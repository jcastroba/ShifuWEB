import { d as db } from '../../../chunks/db_DSGnrivC.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  const body = await request.json();
  const { serverId } = body;
  if (!serverId) return new Response(JSON.stringify({ error: "Server ID required" }), { status: 400 });
  try {
    const settingsRes = await db.query(
      "SELECT telegram_bot_token, verification_code, telegram_chat_id FROM server_settings WHERE server_id = $1",
      [serverId]
    );
    if (settingsRes.rows.length === 0) {
      return new Response(JSON.stringify({ error: "Settings not found" }), { status: 404 });
    }
    const { telegram_bot_token, verification_code, telegram_chat_id } = settingsRes.rows[0];
    if (telegram_chat_id) {
      return new Response(JSON.stringify({ linked: true, chatId: telegram_chat_id }), { status: 200 });
    }
    if (!telegram_bot_token || !verification_code) {
      return new Response(JSON.stringify({ error: "Bot token or code missing" }), { status: 400 });
    }
    const telegramRes = await fetch(`https://api.telegram.org/bot${telegram_bot_token}/getUpdates`);
    const telegramData = await telegramRes.json();
    if (!telegramData.ok) {
      return new Response(JSON.stringify({ error: "Failed to contact Telegram" }), { status: 502 });
    }
    const updates = telegramData.result;
    console.log("Telegram Updates:", JSON.stringify(updates, null, 2));
    const match = updates.find((u) => {
      const msg = u.message || u.edited_message || u.channel_post;
      if (!msg || !msg.text) return false;
      return msg.text.includes(verification_code);
    });
    if (match) {
      const msg = match.message || match.edited_message || match.channel_post;
      const chatId = msg.chat.id;
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

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
