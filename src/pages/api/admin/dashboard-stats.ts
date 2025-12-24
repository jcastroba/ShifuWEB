import type { APIRoute } from "astro";
import db from "../../../utils/db";
import { getUserFromSession } from "../../../utils/auth";

export const GET: APIRoute = async (context) => {
  const user = await getUserFromSession(context);
  if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  const url = new URL(context.request.url);
  const serverId = url.searchParams.get("serverId");
  const startDateStr = url.searchParams.get("startDate");
  const endDateStr = url.searchParams.get("endDate");
  const userIdsStr = url.searchParams.get("userIds"); // Comma separated IDs

  if (!serverId) return new Response(JSON.stringify({ error: "Server ID required" }), { status: 400 });

  // Verify Admin
  const adminCheck = await db.query(
    "SELECT is_admin FROM user_servers WHERE user_id = $1 AND server_id = $2",
    [user.id, serverId]
  );
  if (adminCheck.rows.length === 0 || !adminCheck.rows[0].is_admin) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

  // Build Query Filters
  let queryParams: any[] = [serverId];
  let paramCount = 1;
  let dateFilter = "";
  let userFilter = "";

  if (startDateStr && endDateStr) {
    paramCount++;
    queryParams.push(startDateStr);
    paramCount++;
    queryParams.push(endDateStr);
    dateFilter = `AND s.start_time >= $${paramCount-1} AND s.start_time <= $${paramCount}`;
  }

  if (userIdsStr) {
    const ids = userIdsStr.split(',').filter(Boolean);
    if (ids.length > 0) {
        // Dynamically build IN clause
        const placeholders = ids.map((_, i) => `$${paramCount + 1 + i}`).join(',');
        userFilter = `AND s.user_id IN (${placeholders})`;
        queryParams.push(...ids);
    }
  }

  // 1. Get Historical Shifts
  const historyQuery = `
    SELECT 
      s.id, s.user_id, u.username, u.avatar_url, us.nickname,
      s.start_time, s.end_time, s.observations,
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
    JOIN users u ON s.user_id = u.id
    JOIN user_servers us ON s.user_id = us.user_id AND s.server_id = us.server_id
    LEFT JOIN breaks b ON s.id = b.shift_id
    WHERE s.server_id = $1 ${dateFilter} ${userFilter}
    GROUP BY s.id, u.username, u.avatar_url, us.nickname
    ORDER BY s.start_time DESC
  `;

  const historyRes = await db.query(historyQuery, queryParams);
  const shifts = historyRes.rows;

  // 2. Calculate Stats
  let totalWorkedMs = 0;
  let totalBreaksMs = 0;
  let shiftCount = shifts.length;

  const processedShifts = shifts.map((shift: any) => {
    const start = new Date(shift.start_time).getTime();
    const end = shift.end_time ? new Date(shift.end_time).getTime() : Date.now();
    
    let breakMs = 0;
    shift.breaks.forEach((b: any) => {
      if (b.break_start && b.break_end) {
        breakMs += new Date(b.break_end).getTime() - new Date(b.break_start).getTime();
      }
    });

    const duration = Math.max(0, end - start - breakMs);
    totalWorkedMs += duration;
    totalBreaksMs += breakMs;

    return {
      ...shift,
      durationMs: duration,
      breakMs: breakMs
    };
  });

  // 3. Get All Users for Filter List
  const usersListQuery = `
    SELECT u.id, u.username, us.nickname 
    FROM user_servers us
    JOIN users u ON us.user_id = u.id
    WHERE us.server_id = $1
    ORDER BY us.nickname ASC
  `;
  const usersListRes = await db.query(usersListQuery, [serverId]);

  return new Response(JSON.stringify({
    stats: {
      totalWorkedHours: totalWorkedMs / (1000 * 60 * 60),
      totalBreakHours: totalBreaksMs / (1000 * 60 * 60),
      totalShifts: shiftCount,
    },
    history: processedShifts,
    users: usersListRes.rows
  }));
};
