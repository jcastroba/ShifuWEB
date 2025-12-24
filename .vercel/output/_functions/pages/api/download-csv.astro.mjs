import { d as db } from '../../chunks/db_CQE9smPl.mjs';
import { g as getUserFromSession } from '../../chunks/auth_CVOqfqat.mjs';
export { renderers } from '../../renderers.mjs';

async function GET(context) {
  const user = await getUserFromSession(context);
  if (!user) {
    return new Response("No autorizado", { status: 401 });
  }
  const adminServersQuery = `
    SELECT server_id
    FROM user_servers
    WHERE user_id = $1
      AND is_admin = true
  `;
  const { rows: adminServersData } = await db.query(adminServersQuery, [user.id]);
  const adminServers = adminServersData;
  if (adminServers.length === 0) {
    return new Response("No tienes permisos para descargar este CSV", { status: 403 });
  }
  const serverIds = adminServers.map((row) => row.server_id);
  const shiftsQuery = `
    SELECT
      shifts.id,
      servers.name AS server,
      users.username,
      us.nickname,
      to_char(shifts.start_time, 'DD/MM/YY') AS fecha_inicio_turno,
      to_char(shifts.end_time, 'DD/MM/YY')   AS fecha_final_turno,
      ROUND(
        EXTRACT(EPOCH FROM (shifts.end_time - shifts.start_time)) / 3600
        - COALESCE((
            SELECT SUM(EXTRACT(EPOCH FROM (b.break_end - b.break_start))) / 3600
            FROM breaks b
            WHERE b.shift_id = shifts.id
          ), 0)
      , 2) AS horas_total_trabajadas,
      ROUND(
        COALESCE((
          SELECT SUM(EXTRACT(EPOCH FROM (b.break_end - b.break_start))) / 3600
          FROM breaks b
          WHERE b.shift_id = shifts.id
        ), 0)
      , 2) AS horas_total_breaks,
      COALESCE((
        SELECT string_agg(b.reason, ', ')
        FROM breaks b
        WHERE b.shift_id = shifts.id
      ), '') AS razones
    FROM shifts
    JOIN servers ON servers.id = shifts.server_id
    JOIN user_servers us 
      ON us.server_id = shifts.server_id
     AND us.user_id   = shifts.user_id
    JOIN users ON users.id = shifts.user_id
    WHERE shifts.server_id = ANY($1::int[])
    ORDER BY shifts.id ASC
  `;
  const { rows: shiftsData } = await db.query(shiftsQuery, [serverIds]);
  const shifts = shiftsData;
  let csv = "ID,SERVER,USERNAME,NICKNAME,FECHA INICIO TURNO,FECHA FINAL TURNO,HORAS TOTAL TRABAJADAS,HORAS TOTAL BREAKS,RAZONES\n";
  for (const shift of shifts) {
    const server = shift.server?.replace(/"/g, '""');
    const username = shift.username?.replace(/"/g, '""');
    const nickname = shift.nickname?.replace(/"/g, '""');
    const razones = shift.razones?.replace(/"/g, '""');
    csv += [
      shift.id,
      `"${server}"`,
      `"${username}"`,
      `"${nickname}"`,
      `"${shift.fecha_inicio_turno}"`,
      `"${shift.fecha_final_turno}"`,
      shift.horas_total_trabajadas,
      shift.horas_total_breaks,
      `"${razones}"`
    ].join(",") + "\n";
  }
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="shifts.csv"'
    }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
