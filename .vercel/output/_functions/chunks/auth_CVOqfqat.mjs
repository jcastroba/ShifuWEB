function parseCookies(cookieHeader) {
  return cookieHeader.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split("=");
    acc[key] = decodeURIComponent(value || "");
    return acc;
  }, {});
}
async function getUserFromSession(context) {
  try {
    const cookieHeader = context.request.headers.get("cookie") || "";
    const cookies = parseCookies(cookieHeader);
    const discordUserCookie = cookies["discord_user"];
    if (!discordUserCookie) {
      console.log("⚠️ No se encontró la cookie de usuario.");
      return null;
    }
    const userData = JSON.parse(discordUserCookie);
    return {
      id: userData.id,
      username: userData.username,
      displayName: userData.displayName || userData.globalName || userData.username,
      // Usar displayName si está disponible
      avatarUrl: userData.avatarUrl || `https://cdn.discordapp.com/embed/avatars/0.png`
    };
  } catch (error) {
    console.error("❌ Error obteniendo el usuario desde la sesión:", error);
    return null;
  }
}
function clearUserSession(cookies) {
  cookies.delete("discord_user", { path: "/" });
  console.log("🚪 Sesión cerrada.");
}

export { clearUserSession as c, getUserFromSession as g };
