import type { APIRoute } from "astro";
import db from "../../utils/db";
import { getUserFromSession } from "../../utils/auth";

export const POST: APIRoute = async (context) => {
  const user = await getUserFromSession(context);
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const body = await context.request.json();
  
  // Support both single object and array of updates
  const updates = Array.isArray(body) ? body : [body];

  if (updates.length === 0) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  // Validate first item for serverId (assuming all updates are for same server for permission check efficiency)
  // Ideally we should check each one or group by server, but for this UI, we update one server at a time.
  const serverId = updates[0].serverId;

  if (!serverId) {
      return new Response(JSON.stringify({ error: "Server ID required" }), { status: 400 });
  }

  // Verify requester is admin
  const adminCheck = await db.query(
    "SELECT is_admin FROM user_servers WHERE user_id = $1 AND server_id = $2",
    [user.id, serverId]
  );

  if (adminCheck.rows.length === 0 || !adminCheck.rows[0].is_admin) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

  // Update hours
  try {
      for (const update of updates) {
          const { userId, hours } = update;
          if (userId && hours !== undefined) {
            await db.query(
                "UPDATE user_servers SET weekly_hours = $1 WHERE user_id = $2 AND server_id = $3",
                [hours, userId, serverId]
            );
          }
      }
  } catch (e) {
      console.error(e);
      return new Response(JSON.stringify({ error: "Database error" }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }));
};
