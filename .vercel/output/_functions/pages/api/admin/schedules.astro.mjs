import { d as db } from '../../../chunks/db_CQE9smPl.mjs';
import { g as getUserFromSession } from '../../../chunks/auth_CVOqfqat.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async (context) => {
  const user = await getUserFromSession(context);
  if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  const url = new URL(context.request.url);
  const serverId = url.searchParams.get("serverId");
  const targetUserId = url.searchParams.get("userId");
  if (!serverId || !targetUserId) {
    return new Response(JSON.stringify({ error: "Missing parameters" }), { status: 400 });
  }
  const adminCheck = await db.query(
    "SELECT is_admin FROM user_servers WHERE user_id = $1 AND server_id = $2",
    [user.id, serverId]
  );
  if (adminCheck.rows.length === 0 || !adminCheck.rows[0].is_admin) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }
  const query = `
    SELECT day_of_week, start_time, end_time, is_rest_day
    FROM weekly_schedules
    WHERE user_id = $1 AND server_id = $2
    ORDER BY day_of_week ASC
  `;
  const { rows } = await db.query(query, [targetUserId, serverId]);
  return new Response(JSON.stringify(rows));
};
const POST = async (context) => {
  const user = await getUserFromSession(context);
  if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  const body = await context.request.json();
  const { serverId, targetUserId, schedule, applyProRating } = body;
  if (!serverId || !targetUserId || !Array.isArray(schedule)) {
    return new Response(JSON.stringify({ error: "Invalid data" }), { status: 400 });
  }
  const adminCheck = await db.query(
    "SELECT is_admin FROM user_servers WHERE user_id = $1 AND server_id = $2",
    [user.id, serverId]
  );
  if (adminCheck.rows.length === 0 || !adminCheck.rows[0].is_admin) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }
  try {
    await db.query("BEGIN");
    await db.query(
      "DELETE FROM weekly_schedules WHERE user_id = $1 AND server_id = $2",
      [targetUserId, serverId]
    );
    let totalWeeklyHours = 0;
    for (const day of schedule) {
      await db.query(
        `INSERT INTO weekly_schedules (user_id, server_id, day_of_week, start_time, end_time, is_rest_day)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [targetUserId, serverId, day.day_of_week, day.start_time, day.end_time, day.is_rest_day]
      );
      if (!day.is_rest_day && day.start_time && day.end_time) {
        const start = /* @__PURE__ */ new Date(`1970-01-01T${day.start_time}`);
        const end = /* @__PURE__ */ new Date(`1970-01-01T${day.end_time}`);
        const diff = (end.getTime() - start.getTime()) / (1e3 * 60 * 60);
        if (diff > 0) totalWeeklyHours += diff;
      }
    }
    await db.query(
      "UPDATE user_servers SET weekly_hours = $1 WHERE user_id = $2 AND server_id = $3",
      [Math.round(totalWeeklyHours * 100) / 100, targetUserId, serverId]
    );
    if (applyProRating) {
      const now = /* @__PURE__ */ new Date();
      const currentDay = now.getDay() || 7;
      let hoursToDeduct = 0;
      for (let d = 1; d < currentDay; d++) {
        const daySchedule = schedule.find((s) => s.day_of_week === d);
        if (daySchedule && !daySchedule.is_rest_day && daySchedule.start_time && daySchedule.end_time) {
          const start = /* @__PURE__ */ new Date(`1970-01-01T${daySchedule.start_time}`);
          const end = /* @__PURE__ */ new Date(`1970-01-01T${daySchedule.end_time}`);
          const diff = (end.getTime() - start.getTime()) / (1e3 * 60 * 60);
          if (diff > 0) hoursToDeduct += diff;
        }
      }
      if (hoursToDeduct > 0) {
        await db.query(
          "UPDATE user_servers SET accumulated_debt = COALESCE(accumulated_debt, 0) - $1 WHERE user_id = $2 AND server_id = $3",
          [hoursToDeduct, targetUserId, serverId]
        );
      }
    }
    await db.query("COMMIT");
    return new Response(JSON.stringify({ success: true, totalHours: totalWeeklyHours }));
  } catch (e) {
    await db.query("ROLLBACK");
    console.error(e);
    return new Response(JSON.stringify({ error: "Database error" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
