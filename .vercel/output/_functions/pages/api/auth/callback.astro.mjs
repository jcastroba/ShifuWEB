import { d as db } from '../../../chunks/db_CQE9smPl.mjs';
export { renderers } from '../../../renderers.mjs';

const CLIENT_ID = undefined                         ;
const CLIENT_SECRET = "YQYJc1Fgb8pyYj2wxFnezfanNYooI-S_";
const DISCORD_REDIRECT_URI = "https://shifu-web.vercel.app/api/auth/callback";
const DISCORD_TOKEN_URL = "https://discord.com/api/oauth2/token";
const DISCORD_USER_URL = "https://discord.com/api/users/@me";
const GET = async ({ request, cookies }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  console.log("✅ Código recibido:", code);
  if (!code) {
    return new Response(JSON.stringify({ error: "No code provided" }), {
      status: 400
    });
  }
  try {
    const tokenResponse = await fetch(DISCORD_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: DISCORD_REDIRECT_URI
      })
    });
    const tokenData = await tokenResponse.json();
    console.log("🔑 Token recibido:", tokenData);
    if (!tokenData.access_token) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch access token" }),
        { status: 400 }
      );
    }
    const userResponse = await fetch(DISCORD_USER_URL, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    const discordUser = await userResponse.json();
    console.log("👤 Usuario obtenido:", discordUser);
    try {
      const guildsResponse = await fetch("https://discord.com/api/users/@me/guilds", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      });
      if (guildsResponse.ok) {
        const guilds = await guildsResponse.json();
        if (Array.isArray(guilds)) {
          for (const guild of guilds) {
            if (guild.icon) {
              const iconUrl = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`;
              await db.query(
                `UPDATE servers SET icon_url = $1 WHERE discord_server_id = $2`,
                [iconUrl, guild.id]
              );
            }
          }
        }
      }
    } catch (guildError) {
      console.error("Error fetching/updating guilds:", guildError);
    }
    const userData = {
      id: discordUser.id,
      displayName: discordUser.display_name || discordUser.global_name || discordUser.username,
      // Obtener displayName
      username: discordUser.username,
      avatarUrl: discordUser.avatar ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png` : "https://cdn.discordapp.com/embed/avatars/0.png"
    };
    try {
      await db.query(
        `INSERT INTO users (id, username, avatar_url) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (id) DO UPDATE SET 
           username = EXCLUDED.username, 
           avatar_url = EXCLUDED.avatar_url`,
        [userData.id, userData.username, userData.avatarUrl]
      );
    } catch (dbError) {
      console.error("Error updating user in DB:", dbError);
    }
    cookies.set("discord_user", JSON.stringify(userData), {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7
      // 7 days
    });
    const html = `<!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Autenticación Completa</title>
      </head>
      <body>
        <script>
          // Si se abrió como ventana emergente, redirige la ventana principal y cierra esta pestaña.
          if (window.opener) {
            window.opener.location.href = "/dashboardIndex";
            window.close();
          } else {
            // Si no es una ventana emergente, redirige a /dashboardIndex directamente.
            window.location.href = "/dashboardIndex";
          }
        </script>
      </body>
    </html>`;
    return new Response(html, { headers: { "Content-Type": "text/html" } });
  } catch (error) {
    console.error("❌ Error en la autenticación:", error);
    return new Response(
      JSON.stringify({ error: "Server error", details: error }),
      { status: 500 }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
