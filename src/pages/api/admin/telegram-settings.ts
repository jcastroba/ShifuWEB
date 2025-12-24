import type { APIRoute } from "astro";
import db from "../../../utils/db";

// GET: Obtener configuración actual
export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const serverId = url.searchParams.get("serverId");

  if (!serverId) {
    return new Response(JSON.stringify({ error: "Server ID required" }), { status: 400 });
  }

  try {
    const res = await db.query(
      "SELECT * FROM server_settings WHERE server_id = $1",
      [serverId]
    );
    
    if (res.rows.length === 0) {
      return new Response(JSON.stringify({}), { status: 200 });
    }

    // Ocultamos el token por seguridad, solo enviamos si existe o no
    const data = { ...res.rows[0] };
    if (data.telegram_bot_token) {
        data.telegram_bot_token = "********" + data.telegram_bot_token.slice(-4);
        data.has_token = true;
    } else {
        data.has_token = false;
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Database error" }), { status: 500 });
  }
};

// POST: Guardar configuración y generar código de vinculación
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { 
      serverId, 
      telegramBotToken, 
      alertShiftStart, 
      alertShiftEnd, 
      alertBreakExceeded, 
      alertMissedSchedule,
      maxBreakMinutes,
      scheduleGraceMinutes
    } = body;

    if (!serverId) {
      return new Response(JSON.stringify({ error: "Server ID required" }), { status: 400 });
    }

    // Generar código de vinculación único (ej: "start-123456")
    const verificationCode = `start-${Math.floor(100000 + Math.random() * 900000)}`;

    // Upsert (Insertar o Actualizar)
    await db.query(
      `INSERT INTO server_settings (
        server_id, telegram_bot_token, verification_code,
        alert_shift_start, alert_shift_end, alert_break_exceeded, alert_missed_schedule,
        max_break_minutes, schedule_grace_minutes, updated_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
       ON CONFLICT (server_id) DO UPDATE SET
        telegram_bot_token = COALESCE(NULLIF($2, ''), server_settings.telegram_bot_token),
        verification_code = $3,
        alert_shift_start = $4,
        alert_shift_end = $5,
        alert_break_exceeded = $6,
        alert_missed_schedule = $7,
        max_break_minutes = $8,
        schedule_grace_minutes = $9,
        updated_at = NOW()`,
      [
        serverId, 
        telegramBotToken || null, // Si viene vacío, no lo sobrescribimos en el COALESCE de arriba si ya existe, pero aquí lo pasamos
        verificationCode,
        alertShiftStart, 
        alertShiftEnd, 
        alertBreakExceeded, 
        alertMissedSchedule,
        maxBreakMinutes,
        scheduleGraceMinutes
      ]
    );

    return new Response(JSON.stringify({ 
      success: true, 
      verificationCode,
      message: "Configuración guardada. Usa el código en Telegram para vincular." 
    }), { status: 200 });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
};
