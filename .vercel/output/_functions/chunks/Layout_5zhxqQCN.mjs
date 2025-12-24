import { e as createComponent, f as createAstro, m as maybeRenderHead, j as renderScript, h as addAttribute, i as renderComponent, r as renderTemplate, k as Fragment, l as renderSlot, n as renderHead } from './astro/server_DRFHNOgy.mjs';
import 'kleur/colors';
import 'html-escaper';
/* empty css                             */
import { g as getUserFromSession } from './auth_CVOqfqat.mjs';
import { d as db } from './db_CQE9smPl.mjs';

const $$Astro$1 = createAstro();
const $$Navbar = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Navbar;
  const user = await getUserFromSession(Astro2);
  let isAdmin = false;
  if (user) {
    const adminCheck = await db.query(
      "SELECT 1 FROM user_servers WHERE user_id = $1 AND is_admin = true LIMIT 1",
      [user.id]
    );
    isAdmin = adminCheck.rows.length > 0;
  }
  const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${"1342188880404811886"}&response_type=code&redirect_uri=${encodeURIComponent(undefined                                           )}&scope=identify+guilds`;
  return renderTemplate`${maybeRenderHead()}<nav class="bg-surface dark:bg-secondary-dark border-b border-border-color p-4 transition-colors duration-300"> <div class="container mx-auto flex justify-between items-center"> <!-- Izquierda: Logo y nombre del sitio --> <div class="flex items-center space-x-2"> <img src="/logo.svg" alt="Logo" class="w-full h-24 -rotate-12"> </div> <!-- Derecha: Mostrar usuario autenticado o botón de login --> <div class="flex items-center gap-4"> ${user ? renderTemplate`<div class="relative group inline-block z-50"> <div class="flex items-center space-x-3 cursor-pointer"> <img${addAttribute(user.avatarUrl, "src")} alt="Foto de perfil" class="w-10 h-10 rounded-full border-2 border-primary"> <span class="text-text-main font-bold">${user.displayName}</span> </div> <!-- Menú desplegable --> <div class="absolute right-0 mt-2 w-56 bg-surface dark:bg-gray-800 rounded-xl shadow-2xl border border-border-color
                   opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right"> <div class="py-2"> <a href="/dashboardIndex" class="block px-4 py-2 text-text-main hover:bg-secondary/20 hover:text-primary-dark font-medium">
Mi Dashboard
</a> ${isAdmin && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate` <div class="border-t border-border-color my-1"></div> <p class="px-4 py-1 text-xs font-bold text-text-muted uppercase">Administración</p> <a href="/admin/dashboard" class="block px-4 py-2 text-text-main hover:bg-secondary/20 hover:text-primary-dark font-medium">
Dashboard Admin
</a> <a href="/admin/users" class="block px-4 py-2 text-text-main hover:bg-secondary/20 hover:text-primary-dark font-medium">
Gestión Usuarios
</a> ` })}`} <div class="border-t border-border-color my-1"></div> <a href="/api/auth/logout" class="block px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium">
Cerrar sesión
</a> </div> </div> </div>` : renderTemplate`<a${addAttribute(discordAuthUrl, "href")} class="bg-primary text-white px-6 py-3 rounded-lg flex items-center
                 hover:bg-primary-dark transition-colors font-bold shadow-lg" data-popup="true">
Ingresar con Discord
</a>`} </div> </div> </nav> ${renderScript($$result, "D:/Personal/Todo/Proyectos/Proyectos 2025/Shifu/ShifuWEB/src/components/Navbar.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/Personal/Todo/Proyectos/Proyectos 2025/Shifu/ShifuWEB/src/components/Navbar.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Layout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const user = await getUserFromSession(Astro2);
  return renderTemplate(_a || (_a = __template(['<html lang="es"> <head><meta name="description" content="Shifu Bot es un bot de Discord de control de turnos y breaks para equipos de trabajo."><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"', `><title>Shifu Bot</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Roboto+Condensed&display=swap" rel="stylesheet"><script>
      // Force Dark Mode
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    <\/script>`, "</head> <body> ", ' <main class="flex-1 flex flex-col transition-colors duration-300 relative"> ', " </main> </body></html>"])), addAttribute(Astro2.generator, "content"), renderHead(), renderComponent($$result, "Navbar", $$Navbar, { "user": user }), renderSlot($$result, $$slots["default"]));
}, "D:/Personal/Todo/Proyectos/Proyectos 2025/Shifu/ShifuWEB/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
