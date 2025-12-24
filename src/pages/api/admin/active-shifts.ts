import type { APIRoute } from "astro";
import db from "../../../utils/db";
import { getUserFromSession } from "../../../utils/auth";

export const GET: APIRoute = async (context) => {
  const user = await getUserFromSession(context);
  if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  const url = new URL(context.request.url);
  const serverId = url.searchParams.get("serverId");

  if (!serverId) return new Response(JSON.stringify({ error: "Server ID required" }), { status: 400 });

  // Verify Admin
  const adminCheck = await db.query(
    "SELECT is_admin FROM user_servers WHERE user_id = $1 AND server_id = $2",
    [user.id, serverId]
  );
  if (adminCheck.rows.length === 0 || !adminCheck.rows[0].is_admin) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

  // Get Active Shifts (End Time is NULL)
  const activeQuery = `
    SELECT 
      s.id, s.user_id, u.username, us.nickname,
      s.start_time + INTERVAL '4 hours' as start_time,
      s.observations,
      (
        SELECT json_build_object('id', b.id, 'break_start', b.break_start + INTERVAL '4 hours', 'reason', b.reason)
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
