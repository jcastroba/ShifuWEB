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
  const timeRange = url.searchParams.get("range") || "week"; // day, week, fortnight, month, year

  if (!serverId) {
    return new Response(JSON.stringify({ error: "Server ID required" }), { status: 400 });
  }

  // 1. Get User Server Details (Assigned Hours, Debt)
  const userServerQuery = `
    SELECT weekly_hours, accumulated_debt, joined_at, nickname
    FROM user_servers
    WHERE user_id = $1 AND server_id = $2
  `;
  const userServerRes = await db.query(userServerQuery, [user.id, serverId]);

  if (userServerRes.rows.length === 0) {
    return new Response(JSON.stringify({ error: "User not in server" }), { status: 404 });
  }
  const userServerData = userServerRes.rows[0];

  // 2. Calculate Date Range
  const now = new Date();
  let startDate = new Date();
  
  switch (timeRange) {
    case "day":
      startDate.setHours(0, 0, 0, 0);
      break;
    case "week":
      // Start of current week (Monday)
      const day = now.getDay() || 7; 
      if (day !== 1) startDate.setHours(-24 * (day - 1)); 
      else startDate.setHours(0,0,0,0);
      break;
    case "fortnight":
      startDate.setDate(now.getDate() - 15);
      break;
    case "month":
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      break;
    case "year":
      startDate.setMonth(0, 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    default:
      // Default to week
      const d = now.getDay() || 7; 
      if (d !== 1) startDate.setHours(-24 * (d - 1));
      else startDate.setHours(0,0,0,0);
  }

  // 3. Get Shifts in Range
  const shiftsQuery = `
    SELECT 
      s.id, s.start_time, s.end_time, s.observations,
      COALESCE(
        json_agg(
          json_build_object(
            'break_start', b.break_start,
            'break_end', b.break_end,
            'reason', b.reason
          )
        ) FILTER (WHERE b.id IS NOT NULL), '[]'
      ) as breaks
    FROM shifts s
    LEFT JOIN breaks b ON s.id = b.shift_id
    WHERE s.user_id = $1 AND s.server_id = $2 AND s.start_time >= $3
    GROUP BY s.id
    ORDER BY s.start_time DESC
  `;
  
  const shiftsRes = await db.query(shiftsQuery, [user.id, serverId, startDate.toISOString()]);
  const shifts = shiftsRes.rows;

  // 4. Calculate Worked Hours
  let totalWorkedMs = 0;
  
  const processedShifts = shifts.map((shift: any) => {
    const start = new Date(shift.start_time).getTime();
    const end = shift.end_time ? new Date(shift.end_time).getTime() : Date.now(); // If active, count until now
    
    let breakMs = 0;
    shift.breaks.forEach((b: any) => {
      if (b.break_start && b.break_end) {
        breakMs += new Date(b.break_end).getTime() - new Date(b.break_start).getTime();
      }
    });

    const duration = Math.max(0, end - start - breakMs);
    totalWorkedMs += duration;

    return {
      ...shift,
      durationMs: duration,
      breakMs: breakMs
    };
  });

  const totalWorkedHours = totalWorkedMs / (1000 * 60 * 60);

  return new Response(JSON.stringify({
    serverInfo: userServerData,
    stats: {
      assignedHours: userServerData.weekly_hours,
      workedHours: totalWorkedHours,
      pendingHours: Math.max(0, userServerData.weekly_hours - totalWorkedHours),
      overtime: Math.max(0, totalWorkedHours - userServerData.weekly_hours),
      debt: parseFloat(userServerData.accumulated_debt || "0"),
    },
    shifts: processedShifts
  }));
};
