import { d as db } from '../../../chunks/db_CQE9smPl.mjs';
import { g as getUserFromSession } from '../../../chunks/auth_CVOqfqat.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async (context) => {
  const user = await getUserFromSession(context);
  if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  const body = await context.request.json();
  const { action, shiftId, breakId, serverId, observation } = body;
  if (!serverId || !action) return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
  const adminCheck = await db.query(
    "SELECT is_admin FROM user_servers WHERE user_id = $1 AND server_id = $2",
    [user.id, serverId]
  );
  if (adminCheck.rows.length === 0 || !adminCheck.rows[0].is_admin) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }
  try {
    if (action === "close_shift") {
      if (!shiftId) return new Response(JSON.stringify({ error: "Shift ID required" }), { status: 400 });
      await db.query(
        "UPDATE breaks SET break_end = NOW() WHERE shift_id = $1 AND break_end IS NULL",
        [shiftId]
      );
      await db.query(
        `UPDATE shifts 
             SET end_time = NOW(), 
                 observations = CASE 
                    WHEN observations IS NULL OR observations = '' THEN $2 
                    ELSE observations || E'
' || $2 
                 END
             WHERE id = $1`,
        [shiftId, `[Admin Closed]: ${observation || "No reason provided"}`]
      );
    } else if (action === "end_break") {
      if (!breakId) return new Response(JSON.stringify({ error: "Break ID required" }), { status: 400 });
      await db.query(
        "UPDATE breaks SET break_end = NOW() WHERE id = $1",
        [breakId]
      );
    } else {
      return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 });
    }
    return new Response(JSON.stringify({ success: true }));
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Database error" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
