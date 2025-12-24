import { d as db } from '../../../chunks/db_DSGnrivC.mjs';
import { g as getUserFromSession } from '../../../chunks/auth_CSCHR02c.mjs';
export { renderers } from '../../../renderers.mjs';

const GET = async (context) => {
  const user = await getUserFromSession(context);
  if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  const url = new URL(context.request.url);
  const serverId = url.searchParams.get("serverId");
  if (!serverId) return new Response(JSON.stringify({ error: "Server ID required" }), { status: 400 });
  const adminCheck = await db.query(
    "SELECT is_admin FROM user_servers WHERE user_id = $1 AND server_id = $2",
    [user.id, serverId]
  );
  if (adminCheck.rows.length === 0 || !adminCheck.rows[0].is_admin) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }
  const activeQuery = `
    SELECT 
      s.id, s.user_id, u.username, us.nickname,
      s.start_time, s.observations,
      (
        SELECT json_build_object('id', b.id, 'break_start', b.break_start, 'reason', b.reason)
        FROM breaks b 
        WHERE b.shift_id = s.id AND b.break_end IS NULL
        LIMIT 1
      ) as active_break
    FROM shifts s
    JOIN users u ON s.user_id = u.id
    JOIN user_servers us ON s.user_id = us.user_id AND s.server_id = us.server_id
    WHERE s.server_id = $1 AND s.end_time IS NULL
    ORDER BY s.start_time DESC
  `;
  const activeRes = await db.query(activeQuery, [serverId]);
  return new Response(JSON.stringify(activeRes.rows));
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
