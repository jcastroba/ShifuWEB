import type { APIRoute } from "astro";
import db from "../../../utils/db";
import { getUserFromSession } from "../../../utils/auth";

export const POST: APIRoute = async (context) => {
  const user = await getUserFromSession(context);
  if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  const body = await context.request.json();
  const { action, shiftId, breakId, serverId, observation } = body;

  if (!serverId || !action) return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });

  // Verify Admin
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
        
        // First, close any open breaks for this shift
        await db.query(
            "UPDATE breaks SET break_end = NOW() WHERE shift_id = $1 AND break_end IS NULL",
            [shiftId]
        );

        // Then close the shift
        await db.query(
            `UPDATE shifts 
             SET end_time = NOW(), 
                 observations = CASE 
                    WHEN observations IS NULL OR observations = '' THEN $2 
                    ELSE observations || E'\n' || $2 
                 END
             WHERE id = $1`,
            [shiftId, `[Admin Closed]: ${observation || 'No reason provided'}`]
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
