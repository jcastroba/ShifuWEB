import { d as db } from '../../../chunks/db_CQE9smPl.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  const body = await request.json();
  const { serverId } = body;
  if (!serverId) return new Response(JSON.stringify({ error: "Server ID required" }), { status: 400 });
  try {
    const res = await db.query(
      "SELECT telegram_bot_token, telegram_chat_id FROM server_settings WHERE server_id = $1",
      [serverId]
    );
    if (res.rows.length === 0 || !res.rows[0].telegram_bot_token || !res.rows[0].telegram_chat_id) {
      return new Response(JSON.stringify({ error: "Telegram not configured" }), { status: 400 });
    }
    const { telegram_bot_token, telegram_chat_id } = res.rows[0];
    const message = "🔔 *Prueba de Notificación*\n\n¡Hola! Si estás leyendo esto, el bot de Shifu está correctamente configurado para este servidor. 🚀";
    const telegramRes = await fetch(`https://api.telegram.org/bot${telegram_bot_token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: telegram_chat_id,
        text: message,
        parse_mode: "Markdown"
      })
    });
    const data = await telegramRes.json();
    if (!data.ok) {
      return new Response(JSON.stringify({ error: "Failed to send message", details: data }), { status: 500 });
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
