import type { APIRoute } from "astro";
import db from "../../../utils/db";

// Este endpoint será llamado por el frontend para ver si ya se vinculó el chat
export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const { serverId } = body;

  if (!serverId) return new Response(JSON.stringify({ error: "Server ID required" }), { status: 400 });

  try {
    // 1. Obtener el token y el código esperado
    const settingsRes = await db.query(
      "SELECT telegram_bot_token, verification_code, telegram_chat_id FROM server_settings WHERE server_id = $1",
      [serverId]
    );

    if (settingsRes.rows.length === 0) {
      return new Response(JSON.stringify({ error: "Settings not found" }), { status: 404 });
    }

    const { telegram_bot_token, verification_code, telegram_chat_id } = settingsRes.rows[0];

    // Si ya tiene chat_id, devolvemos éxito
    if (telegram_chat_id) {
      return new Response(JSON.stringify({ linked: true, chatId: telegram_chat_id }), { status: 200 });
    }

    if (!telegram_bot_token || !verification_code) {
      return new Response(JSON.stringify({ error: "Bot token or code missing" }), { status: 400 });
    }

    // 2. Consultar a Telegram getUpdates para buscar el código
    // Nota: Esto es una implementación simple de "Long Polling" manual.
    // En producción real, un Webhook es mejor, pero esto funciona sin exponer puertos públicos.
    const telegramRes = await fetch(`https://api.telegram.org/bot${telegram_bot_token}/getUpdates`);
    const telegramData = await telegramRes.json();

    if (!telegramData.ok) {
      return new Response(JSON.stringify({ error: "Failed to contact Telegram" }), { status: 502 });
    }

    // 3. Buscar el mensaje con el código
    // El código debe ser enviado como "/start-123456" o simplemente "start-123456"
    const updates = telegramData.result;
    
    // Debug: Imprimir updates para ver qué llega
    console.log("Telegram Updates:", JSON.stringify(updates, null, 2));

    const match = updates.find((u: any) => {
      // A veces el mensaje viene en 'message', otras en 'edited_message', o 'channel_post'
      const msg = u.message || u.edited_message || u.channel_post;
      if (!msg || !msg.text) return false;
      return msg.text.includes(verification_code);
    });

    if (match) {
      const msg = match.message || match.edited_message || match.channel_post;
      const chatId = msg.chat.id;
      
      // 4. Guardar el Chat ID y borrar el código (ya se usó)
      await db.query(
        "UPDATE server_settings SET telegram_chat_id = $1, verification_code = NULL WHERE server_id = $2",
        [chatId, serverId]
      );

      return new Response(JSON.stringify({ linked: true, chatId }), { status: 200 });
    }

    return new Response(JSON.stringify({ linked: false }), { status: 200 });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
};
