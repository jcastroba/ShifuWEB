import type { APIRoute } from "astro";
import db from "../../../utils/db";
import { getUserFromSession } from "../../../utils/auth";

export const POST: APIRoute = async (context) => {
  const user = await getUserFromSession(context);
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const body = await context.request.json();
  const { serverId, targetUserId, amount, type } = body; 
  // type: 'partial' | 'total'

  if (!serverId || !targetUserId || !type) {
    return new Response(JSON.stringify({ error: "Missing parameters" }), { status: 400 });
  }

  // Verify Admin
  const adminCheck = await db.query(
    "SELECT is_admin FROM user_servers WHERE user_id = $1 AND server_id = $2",
    [user.id, serverId]
  );

  if (adminCheck.rows.length === 0 || !adminCheck.rows[0].is_admin) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

  try {
    if (type === 'total') {
        await db.query(
            "UPDATE user_servers SET accumulated_debt = 0 WHERE user_id = $1 AND server_id = $2",
            [targetUserId, serverId]
        );
    } else {
        if (amount === undefined || amount < 0) {
            return new Response(JSON.stringify({ error: "Invalid amount" }), { status: 400 });
        }
        // Ensure we don't go below 0? Or allow negative debt (credit)? 
        // Usually debt reduction implies reducing the positive number.
        // Let's assume we subtract the amount.
        await db.query(
            "UPDATE user_servers SET accumulated_debt = GREATEST(0, accumulated_debt - $1) WHERE user_id = $2 AND server_id = $3",
            [amount, targetUserId, serverId]
        );
    }

    return new Response(JSON.stringify({ success: true }));

  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: "Database error" }), { status: 500 });
  }
};
