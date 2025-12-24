import type { APIRoute } from "astro";
import db from "../../utils/db";
import { getUserFromSession } from "../../utils/auth";

export const GET: APIRoute = async (context) => {
  const user = await getUserFromSession(context);
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const url = new URL(context.request.url);
  const serverId = url.searchParams.get("serverId");

  if (!serverId) {
    return new Response(JSON.stringify({ error: "Server ID required" }), { status: 400 });
  }

  // Verify requester is admin of this server
  const adminCheck = await db.query(
    "SELECT is_admin FROM user_servers WHERE user_id = $1 AND server_id = $2",
    [user.id, serverId]
  );

  if (adminCheck.rows.length === 0 || !adminCheck.rows[0].is_admin) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

  // Fetch users
  const usersQuery = `
    SELECT u.id, u.username, us.nickname, us.weekly_hours, us.accumulated_debt
    FROM user_servers us
    JOIN users u ON us.user_id = u.id
    WHERE us.server_id = $1
    ORDER BY us.nickname ASC
  `;
  const { rows } = await db.query(usersQuery, [serverId]);

  return new Response(JSON.stringify(rows));
};
