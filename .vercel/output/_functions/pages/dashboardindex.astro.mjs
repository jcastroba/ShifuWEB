/* empty css                                     */
import { e as createComponent, f as createAstro, m as maybeRenderHead, i as renderComponent, r as renderTemplate } from '../chunks/astro/server_DRFHNOgy.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../chunks/Layout_5zhxqQCN.mjs';
import { d as db } from '../chunks/db_CQE9smPl.mjs';
import { g as getUserFromSession } from '../chunks/auth_CVOqfqat.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import { Calendar, CheckCircle, Clock, AlertCircle, History } from 'lucide-react';
import { S as ShiftDetailModal } from '../chunks/ShiftDetailModal_CVAwd1Ft.mjs';
export { renderers } from '../renderers.mjs';

function UserDashboard({ userServers }) {
  const [selectedServer, setSelectedServer] = useState(userServers.length > 0 ? String(userServers[0].id) : "");
  const [timeRange, setTimeRange] = useState("week");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const currentServer = userServers.find((s) => String(s.id) === selectedServer);
  useEffect(() => {
    if (!selectedServer) return;
    setLoading(true);
    fetch(`/api/user-stats?serverId=${selectedServer}&range=${timeRange}`).then((res) => res.json()).then((d) => {
      setData(d);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, [selectedServer, timeRange]);
  if (userServers.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "text-center p-10 text-text-muted", children: "No perteneces a ningún servidor registrado." });
  }
  const formatDuration = (ms) => {
    const totalSeconds = Math.floor(ms / 1e3);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(totalSeconds % 3600 / 60);
    return `${hours}h ${minutes}m`;
  };
  const formatHours = (hours) => {
    return hours.toFixed(2) + "h";
  };
  return /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto p-4 space-y-6 font-roboto", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-secondary-dark rounded-xl shadow-lg p-6 flex flex-col md:flex-row justify-between items-center gap-4 border-l-4 border-primary-dark transition-colors duration-300", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-lilita text-secondary-dark dark:text-primary", children: "Mi Panel de Control" }),
        /* @__PURE__ */ jsx("p", { className: "text-text-muted text-sm", children: "Resumen de actividad y horas" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-4 w-full md:w-auto items-center", children: [
        currentServer?.icon_url && /* @__PURE__ */ jsx(
          "img",
          {
            src: currentServer.icon_url,
            alt: currentServer.name,
            className: "w-10 h-10 rounded-full border border-border-color shadow-sm"
          }
        ),
        /* @__PURE__ */ jsx(
          "select",
          {
            value: selectedServer,
            onChange: (e) => setSelectedServer(e.target.value),
            className: "p-2 border rounded-lg bg-background dark:bg-gray-800 border-border-color text-text-main focus:ring-2 focus:ring-primary outline-none flex-1",
            children: userServers.map((s) => /* @__PURE__ */ jsx("option", { value: s.id, children: s.name }, s.id))
          }
        ),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: timeRange,
            onChange: (e) => setTimeRange(e.target.value),
            className: "p-2 border rounded-lg bg-background dark:bg-gray-800 border-border-color text-text-main focus:ring-2 focus:ring-primary outline-none",
            children: [
              /* @__PURE__ */ jsx("option", { value: "day", children: "Hoy" }),
              /* @__PURE__ */ jsx("option", { value: "week", children: "Esta Semana" }),
              /* @__PURE__ */ jsx("option", { value: "fortnight", children: "Últimos 15 días" }),
              /* @__PURE__ */ jsx("option", { value: "month", children: "Este Mes" }),
              /* @__PURE__ */ jsx("option", { value: "year", children: "Este Año" })
            ]
          }
        )
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsxs("div", { className: "text-center py-20", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary-dark mx-auto" }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-text-muted", children: "Cargando datos..." })
    ] }) : data ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-secondary-dark p-6 rounded-xl shadow-md border-t-4 border-blue-500 transition-colors duration-300", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-text-muted text-sm font-medium", children: "Horas Asignadas" }),
              /* @__PURE__ */ jsxs("h3", { className: "text-3xl font-bold text-text-main mt-1", children: [
                data.stats.assignedHours,
                "h"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400", children: /* @__PURE__ */ jsx(Calendar, { size: 24 }) })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-text-muted mt-2", children: "Meta semanal" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-secondary-dark p-6 rounded-xl shadow-md border-t-4 border-green-500 transition-colors duration-300", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-text-muted text-sm font-medium", children: "Horas Trabajadas" }),
              /* @__PURE__ */ jsx("h3", { className: "text-3xl font-bold text-text-main mt-1", children: formatHours(data.stats.workedHours) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400", children: /* @__PURE__ */ jsx(CheckCircle, { size: 24 }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-3", children: /* @__PURE__ */ jsx(
            "div",
            {
              className: "bg-green-500 h-2.5 rounded-full",
              style: { width: `${Math.min(100, data.stats.workedHours / (data.stats.assignedHours || 1) * 100)}%` }
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-secondary-dark p-6 rounded-xl shadow-md border-t-4 border-yellow-500 transition-colors duration-300", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-text-muted text-sm font-medium", children: "Pendientes" }),
              /* @__PURE__ */ jsx("h3", { className: "text-3xl font-bold text-text-main mt-1", children: formatHours(data.stats.pendingHours) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-yellow-600 dark:text-yellow-400", children: /* @__PURE__ */ jsx(Clock, { size: 24 }) })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-text-muted mt-2", children: "Restantes para cumplir meta" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-secondary-dark p-6 rounded-xl shadow-md border-t-4 border-purple-500 transition-colors duration-300", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-text-muted text-sm font-medium", children: "Horas Extras" }),
              /* @__PURE__ */ jsx("h3", { className: "text-3xl font-bold text-text-main mt-1", children: formatHours(data.stats.overtime) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400", children: /* @__PURE__ */ jsx(AlertCircle, { size: 24 }) })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-text-muted mt-2", children: "Superando la meta" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-secondary-dark p-6 rounded-xl shadow-md border-t-4 border-red-500 transition-colors duration-300", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-text-muted text-sm font-medium", children: "Deuda Acumulada" }),
              /* @__PURE__ */ jsxs("h3", { className: "text-3xl font-bold text-red-600 dark:text-red-400 mt-1", children: [
                data.stats.debt,
                "h"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400", children: /* @__PURE__ */ jsx(AlertCircle, { size: 24 }) })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-text-muted mt-2", children: "Total histórico" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-secondary-dark p-6 rounded-xl shadow-md lg:col-span-2 transition-colors duration-300", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-text-main mb-4", children: "Progreso Actual" }),
          /* @__PURE__ */ jsx("div", { className: "h-64", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(
            BarChart,
            {
              data: [
                { name: "Asignadas", horas: data.stats.assignedHours },
                { name: "Trabajadas", horas: data.stats.workedHours },
                { name: "Pendientes", horas: data.stats.pendingHours }
              ],
              layout: "vertical",
              children: [
                /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--border-color)" }),
                /* @__PURE__ */ jsx(XAxis, { type: "number", stroke: "var(--text-muted)" }),
                /* @__PURE__ */ jsx(YAxis, { dataKey: "name", type: "category", width: 100, stroke: "var(--text-muted)" }),
                /* @__PURE__ */ jsx(
                  Tooltip,
                  {
                    contentStyle: { backgroundColor: "var(--surface)", borderColor: "var(--border-color)", color: "var(--text-main)" },
                    itemStyle: { color: "var(--text-main)" }
                  }
                ),
                /* @__PURE__ */ jsx(Legend, {}),
                /* @__PURE__ */ jsx(Bar, { dataKey: "horas", fill: "#DB2777", radius: [0, 4, 4, 0], barSize: 30 })
              ]
            }
          ) }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-secondary-dark p-6 rounded-xl shadow-md transition-colors duration-300", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-text-main", children: "Historial Reciente" }),
            /* @__PURE__ */ jsx(History, { size: 20, className: "text-text-muted" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-4 max-h-[400px] overflow-y-auto pr-2", children: data.shifts.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-text-muted text-sm text-center py-4", children: "No hay registros en este periodo." }) : data.shifts.map((shift) => /* @__PURE__ */ jsxs(
            "div",
            {
              onClick: () => setSelectedShift(shift),
              className: "p-3 bg-background dark:bg-gray-800 rounded-lg border border-border-color hover:bg-secondary/10 transition-colors cursor-pointer",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-primary-dark dark:text-primary", children: new Date(shift.start_time).toLocaleDateString() }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full", children: formatDuration(shift.durationMs) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "text-sm text-text-main", children: [
                  new Date(shift.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  " -",
                  shift.end_time ? new Date(shift.end_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "En curso"
                ] }),
                shift.observations && /* @__PURE__ */ jsxs("p", { className: "text-xs text-text-muted mt-1 italic truncate", children: [
                  '"',
                  shift.observations,
                  '"'
                ] })
              ]
            },
            shift.id
          )) })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        ShiftDetailModal,
        {
          shift: selectedShift,
          onClose: () => setSelectedShift(null)
        }
      )
    ] }) : null
  ] });
}

const $$Astro$1 = createAstro();
const $$Dashboard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Dashboard;
  const user = await getUserFromSession(Astro2);
  if (!user) {
    throw new Error("No hay usuario autenticado");
  }
  const userServersQuery = `
  SELECT s.id, s.name, s.icon_url
  FROM servers s
  JOIN user_servers us ON s.id = us.server_id
  WHERE us.user_id = $1
`;
  const { rows: userServers } = await db.query(userServersQuery, [user.id]);
  return renderTemplate`${maybeRenderHead()}<div class="min-h-[calc(100vh-64px)] bg-background dark:bg-gray-900 transition-colors duration-300"> ${renderComponent($$result, "UserDashboard", UserDashboard, { "client:load": true, "userServers": userServers, "client:component-hydration": "load", "client:component-path": "D:/Personal/Todo/Proyectos/Proyectos 2025/Shifu/ShifuWEB/src/components/UserDashboard", "client:component-export": "default" })} </div> <button class="fixed bottom-5 right-5 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg z-50 transition-transform hover:scale-110 flex items-center gap-2" onclick="window.location.href='/api/download-csv'" title="Descargar CSV"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg> </button>`;
}, "D:/Personal/Todo/Proyectos/Proyectos 2025/Shifu/ShifuWEB/src/components/Dashboard.astro", void 0);

const $$Astro = createAstro();
const prerender = false;
const $$DashboardIndex = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$DashboardIndex;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Dashboard", $$Dashboard, {})} ` })}`;
}, "D:/Personal/Todo/Proyectos/Proyectos 2025/Shifu/ShifuWEB/src/pages/dashboardIndex.astro", void 0);

const $$file = "D:/Personal/Todo/Proyectos/Proyectos 2025/Shifu/ShifuWEB/src/pages/dashboardIndex.astro";
const $$url = "/dashboardIndex";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$DashboardIndex,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
