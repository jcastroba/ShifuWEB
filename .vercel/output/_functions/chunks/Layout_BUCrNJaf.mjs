import { c as createComponent, a as createAstro, m as maybeRenderHead, r as renderScript, b as addAttribute, d as renderComponent, e as renderTemplate, F as Fragment, f as renderSlot, g as renderHead } from './astro/server_C_x741Bc.mjs';
import 'kleur/colors';
/* empty css                             */
import { g as getUserFromSession } from './auth_CSCHR02c.mjs';
import { d as db } from './db_DSGnrivC.mjs';

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
  const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${"1342188880404811886"}&response_type=code&redirect_uri=${encodeURIComponent("http://localhost:4321/api/auth/callback")}&scope=identify+guilds`;
  return renderTemplate`${maybeRenderHead()}<nav class="bg-surface dark:bg-secondary-dark border-b border-border-color p-4 transition-colors duration-300"> <div class="container mx-auto flex justify-between items-center"> <!-- Izquierda: Logo y nombre del sitio --> <div class="flex items-center space-x-2"> <img src="/logo.svg" alt="Logo" class="w-full h-24 -rotate-12"> </div> <!-- Derecha: Mostrar usuario autenticado o botón de login --> <div class="flex items-center gap-4"> <!-- Theme Toggle Button --> <button id="theme-toggle" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-text-main"> <!-- Sun Icon --> <svg id="theme-toggle-light-icon" class="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fill-rule="evenodd" clip-rule="evenodd"></path></svg> <!-- Moon Icon --> <svg id="theme-toggle-dark-icon" class="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg> </button> ${user ? renderTemplate`<div class="relative group inline-block z-50"> <div class="flex items-center space-x-3 cursor-pointer"> <img${addAttribute(user.avatarUrl, "src")} alt="Foto de perfil" class="w-10 h-10 rounded-full border-2 border-primary"> <span class="text-text-main font-bold">${user.displayName}</span> </div> <!-- Menú desplegable --> <div class="absolute right-0 mt-2 w-56 bg-surface dark:bg-gray-800 rounded-xl shadow-2xl border border-border-color
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
      // Check for saved theme or system preference
      const theme = (() => {
        if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
          return localStorage.getItem('theme');
        }
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          return 'dark';
        }
        return 'light';
      })();
    
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    <\/script>`, "</head> <body> ", ' <main class="flex-1 flex flex-col transition-colors duration-300 relative"> ', " </main> </body></html>"])), addAttribute(Astro2.generator, "content"), renderHead(), renderComponent($$result, "Navbar", $$Navbar, { "user": user }), renderSlot($$result, $$slots["default"]));
}, "D:/Personal/Todo/Proyectos/Proyectos 2025/Shifu/ShifuWEB/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
