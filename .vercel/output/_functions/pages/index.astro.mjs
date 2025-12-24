/* empty css                                     */
import { e as createComponent, m as maybeRenderHead, h as addAttribute, r as renderTemplate, f as createAstro, i as renderComponent } from '../chunks/astro/server_DRFHNOgy.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../chunks/Layout_5zhxqQCN.mjs';
import 'clsx';
export { renderers } from '../renderers.mjs';

const $$Login = createComponent(($$result, $$props, $$slots) => {
  const CLIENT_ID = undefined                         ;
  const REDIRECT_URI = "https://shifu-web.vercel.app/api/auth/callback";
  const oauthUrl = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=identify+guilds`;
  return renderTemplate`<!-- Contenedor principal a pantalla completa -->${maybeRenderHead()}<div class="flex flex-1 w-full h-full absolute inset-0"> <!-- Sección Izquierda --> <div class="w-full md:w-5/12 h-full bg-surface dark:bg-secondary-dark relative overflow-visible flex flex-col justify-center p-10 md:p-20 space-y-6 z-10 transition-colors duration-300"> <!-- Difuminado en el borde derecho que se superpone a la imagen de la derecha (solo desktop) --> <div class="hidden md:block absolute inset-y-0 right-[-2rem] w-16 bg-gradient-to-r from-surface dark:from-secondary-dark to-transparent pointer-events-none transition-colors duration-300"></div> <h1 class="text-4xl font-bold text-text-main dark:text-white font-lilita text-left">
El mejor bot controlador<br>
de turnos de Discord
</h1> <p class="text-xl text-text-muted dark:text-gray-200 font-roboto text-left">
Shifu es una hermosa y cruel asistente, <br>
que te ayudara a controlar los tiempos de tu espacio de trabajo,<br>
midiendo el tiempo que trabajas y que descansas,<br>
llevando control de tus turnos.
</p> <a href="#"${addAttribute(`window.open('${oauthUrl}','popup','width=600,height=800'); return false;`, "onclick")} class="bg-primary text-white px-6 py-3 rounded-lg flex items-center w-fit hover:bg-primary-dark transition-colors font-bold shadow-lg"> <img src="/discord.svg" alt="Discord" class="w-8 h-8 mr-2">
Agrega a tu discord
</a> </div> <!-- Sección Derecha con imagen de fondo --> <div class="hidden md:block w-7/12 h-full bg-cover bg-no-repeat" style="background-image: url('/fondo.png'); background-position: 25% center;"> <!-- Puedes agregar contenido adicional si lo deseas --> </div> </div>`;
}, "D:/Personal/Todo/Proyectos/Proyectos 2025/Shifu/ShifuWEB/src/components/Login.astro", void 0);

const $$Astro = createAstro();
const prerender = false;
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Login", $$Login, {})} ` })}`;
}, "D:/Personal/Todo/Proyectos/Proyectos 2025/Shifu/ShifuWEB/src/pages/index.astro", void 0);

const $$file = "D:/Personal/Todo/Proyectos/Proyectos 2025/Shifu/ShifuWEB/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
