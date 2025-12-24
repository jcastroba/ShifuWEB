/* empty css                                        */
import { e as createComponent, f as createAstro, i as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DRFHNOgy.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from '../../chunks/Layout_5zhxqQCN.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, Save, DollarSign, X, AlertCircle } from 'lucide-react';
import { d as db } from '../../chunks/db_CQE9smPl.mjs';
import { g as getUserFromSession } from '../../chunks/auth_CVOqfqat.mjs';
export { renderers } from '../../renderers.mjs';

const DAYS = [
  { id: 1, name: "Lunes" },
  { id: 2, name: "Martes" },
  { id: 3, name: "Miércoles" },
  { id: 4, name: "Jueves" },
  { id: 5, name: "Viernes" },
  { id: 6, name: "Sábado" },
  { id: 7, name: "Domingo" }
];
function ScheduleManager({ serverId, userId, onSave }) {
  const [globalStart, setGlobalStart] = useState("09:00");
  const [globalEnd, setGlobalEnd] = useState("17:00");
  const [restDays, setRestDays] = useState([]);
  const [applyProRating, setApplyProRating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [totalHours, setTotalHours] = useState(0);
  useEffect(() => {
    if (userId && serverId) {
      fetchSchedule();
    }
  }, [userId, serverId]);
  useEffect(() => {
    calculateTotal();
  }, [globalStart, globalEnd, restDays]);
  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/schedules?serverId=${serverId}&userId=${userId}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const workingDay = data.find((d) => !d.is_rest_day);
        if (workingDay) {
          setGlobalStart(workingDay.start_time ? workingDay.start_time.slice(0, 5) : "09:00");
          setGlobalEnd(workingDay.end_time ? workingDay.end_time.slice(0, 5) : "17:00");
        }
        const rDays = data.filter((d) => d.is_rest_day).map((d) => d.day_of_week);
        setRestDays(rDays);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  const calculateTotal = () => {
    if (!globalStart || !globalEnd) {
      setTotalHours(0);
      return;
    }
    const start = /* @__PURE__ */ new Date(`1970-01-01T${globalStart}`);
    const end = /* @__PURE__ */ new Date(`1970-01-01T${globalEnd}`);
    let diff = (end.getTime() - start.getTime()) / (1e3 * 60 * 60);
    if (diff < 0) diff = 0;
    const workingDaysCount = 7 - restDays.length;
    setTotalHours(diff * workingDaysCount);
  };
  const toggleRestDay = (dayId) => {
    if (restDays.includes(dayId)) {
      setRestDays(restDays.filter((id) => id !== dayId));
    } else {
      setRestDays([...restDays, dayId]);
    }
  };
  const handleSave = async () => {
    setSaving(true);
    try {
      const schedule = DAYS.map((day) => ({
        day_of_week: day.id,
        start_time: globalStart,
        end_time: globalEnd,
        is_rest_day: restDays.includes(day.id)
      }));
      const res = await fetch("/api/admin/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serverId,
          targetUserId: userId,
          schedule,
          applyProRating
        })
      });
      if (res.ok) {
        const data = await res.json();
        setTotalHours(data.totalHours);
        if (onSave) onSave();
        alert("Horario guardado correctamente");
      } else {
        alert("Error al guardar horario");
      }
    } catch (e) {
      console.error(e);
      alert("Error de conexión");
    } finally {
      setSaving(false);
    }
  };
  if (loading) return /* @__PURE__ */ jsx("div", { className: "p-4 text-center text-text-main", children: "Cargando horario..." });
  return /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-secondary-dark p-6 rounded-xl shadow-lg font-roboto border border-border", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-xl font-lilita text-secondary-dark dark:text-white flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Calendar, { className: "text-primary" }),
        " Configuración de Horario"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-primary/10 px-4 py-2 rounded-lg border border-primary/20", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm text-primary font-bold uppercase", children: "Total Semanal" }),
        /* @__PURE__ */ jsxs("p", { className: "text-2xl font-bold text-primary-dark dark:text-primary", children: [
          totalHours.toFixed(1),
          "h"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-background p-4 rounded-lg border border-border mb-6 flex flex-col md:flex-row gap-6 items-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Clock, { className: "text-primary" }),
        /* @__PURE__ */ jsx("span", { className: "font-bold text-text-main", children: "Horario General:" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs text-text-muted mb-1", children: "Entrada" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "time",
              value: globalStart,
              onChange: (e) => setGlobalStart(e.target.value),
              className: "border border-border bg-white dark:bg-secondary-dark text-text-main rounded-lg p-2 font-mono focus:ring-primary focus:border-primary"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-text-muted mt-4", children: "-" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs text-text-muted mb-1", children: "Salida" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "time",
              value: globalEnd,
              onChange: (e) => setGlobalEnd(e.target.value),
              className: "border border-border bg-white dark:bg-secondary-dark text-text-main rounded-lg p-2 font-mono focus:ring-primary focus:border-primary"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsx("h4", { className: "font-bold text-text-main mb-3", children: "Selecciona los días de descanso:" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: DAYS.map((day) => {
        const isRest = restDays.includes(day.id);
        return /* @__PURE__ */ jsxs(
          "div",
          {
            onClick: () => toggleRestDay(day.id),
            className: `
                            cursor-pointer p-3 rounded-lg border transition-all flex items-center justify-between
                            ${isRest ? "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-800 dark:text-green-300 shadow-sm" : "bg-white dark:bg-secondary-dark border-border text-text-muted hover:bg-background"}
                        `,
            children: [
              /* @__PURE__ */ jsx("span", { className: "font-bold", children: day.name }),
              isRest && /* @__PURE__ */ jsx(CheckCircle, { size: 16 })
            ]
          },
          day.id
        );
      }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "checkbox",
          id: "proRating",
          checked: applyProRating,
          onChange: (e) => setApplyProRating(e.target.checked),
          className: "w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
        }
      ),
      /* @__PURE__ */ jsxs("label", { htmlFor: "proRating", className: "text-sm text-text-main font-medium cursor-pointer select-none", children: [
        "Aplicar prorrateo (inicio a mitad de semana)",
        /* @__PURE__ */ jsx("p", { className: "text-xs text-text-muted font-normal mt-1", children: "Si se marca, se restarán de la deuda las horas correspondientes a los días de esta semana que ya han pasado." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-8 flex justify-end border-t border-border pt-4", children: /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: handleSave,
        disabled: saving,
        className: "flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors font-bold disabled:opacity-50 shadow-lg",
        children: [
          /* @__PURE__ */ jsx(Save, { size: 20 }),
          saving ? "Guardando..." : "Guardar Configuración"
        ]
      }
    ) })
  ] });
}

function AdminHoursManager({ adminServers }) {
  const [selectedServer, setSelectedServer] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scheduleModalUser, setScheduleModalUser] = useState(null);
  const [debtModalUser, setDebtModalUser] = useState(null);
  const [debtAmount, setDebtAmount] = useState("");
  const [debtType, setDebtType] = useState("partial");
  const fetchUsers = () => {
    if (!selectedServer) {
      setUsers([]);
      return;
    }
    setLoading(true);
    fetch(`/api/server-users?serverId=${selectedServer}`).then((res) => res.json()).then((data) => {
      setUsers(data);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setLoading(false);
    });
  };
  useEffect(() => {
    fetchUsers();
  }, [selectedServer]);
  const handleReduceDebt = async () => {
    if (!debtModalUser || !selectedServer) return;
    try {
      const res = await fetch("/api/admin/reduce-debt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serverId: selectedServer,
          targetUserId: debtModalUser.id,
          amount: debtType === "partial" ? parseFloat(debtAmount) : 0,
          type: debtType
        })
      });
      if (res.ok) {
        setDebtModalUser(null);
        setDebtAmount("");
        fetchUsers();
      } else {
        alert("Error al reducir deuda");
      }
    } catch (e) {
      console.error(e);
      alert("Error de conexión");
    }
  };
  if (adminServers.length === 0) return null;
  return /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-secondary-dark p-6 rounded-lg shadow-md mt-6 font-roboto border border-border", children: [
    /* @__PURE__ */ jsx("div", { className: "flex justify-between items-center mb-6", children: /* @__PURE__ */ jsx("h2", { className: "text-2xl font-lilita text-secondary-dark dark:text-white", children: "Gestión de Usuarios" }) }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-text-main mb-2", children: "Seleccionar Servidor" }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          className: "block w-full md:w-1/3 pl-3 pr-10 py-2 text-base bg-background text-text-main border-border focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md border",
          value: selectedServer,
          onChange: (e) => setSelectedServer(e.target.value),
          children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Seleccione un servidor..." }),
            adminServers.map((s) => /* @__PURE__ */ jsx("option", { value: s.id, children: s.name }, s.id))
          ]
        }
      )
    ] }),
    loading && /* @__PURE__ */ jsx("div", { className: "flex justify-center py-10", children: /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-10 w-10 border-b-2 border-primary" }) }),
    !loading && users.length > 0 && /* @__PURE__ */ jsx("div", { className: "overflow-x-auto bg-background rounded-lg border border-border", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-border", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-secondary-dark text-white", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider", children: "Usuario" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider", children: "Horas Semanales" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider", children: "Deuda" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider", children: "Acciones" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "bg-white dark:bg-secondary-dark divide-y divide-border", children: users.map((user) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-background transition-colors", children: [
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsx("div", { className: "flex items-center", children: /* @__PURE__ */ jsxs("div", { className: "ml-4", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-text-main", children: user.nickname || user.username }),
          /* @__PURE__ */ jsxs("div", { className: "text-sm text-text-muted", children: [
            "@",
            user.username
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center bg-background rounded-lg p-2 w-24 border border-border", children: [
          /* @__PURE__ */ jsx("span", { className: "font-bold text-text-main text-lg", children: user.weekly_hours || 0 }),
          /* @__PURE__ */ jsx("span", { className: "ml-1 text-text-muted text-xs", children: "hrs" })
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: `flex items-center justify-center rounded-lg p-2 w-24 border border-border ${Number(user.accumulated_debt) > 0 ? "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400" : "bg-background text-text-main"}`, children: [
          /* @__PURE__ */ jsx("span", { className: "font-bold text-lg", children: Number(user.accumulated_debt || 0).toFixed(1) }),
          /* @__PURE__ */ jsx("span", { className: "ml-1 text-xs", children: "hrs" })
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setScheduleModalUser(user),
              className: "flex items-center gap-1 text-primary hover:text-primary-dark font-bold text-sm bg-primary/10 px-3 py-1 rounded-lg transition-colors",
              children: [
                /* @__PURE__ */ jsx(Calendar, { size: 16 }),
                "Gestionar Horario"
              ]
            }
          ),
          Number(user.accumulated_debt) > 0 && /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                setDebtModalUser(user);
                setDebtType("partial");
                setDebtAmount("");
              },
              className: "flex items-center gap-1 text-red-600 hover:text-red-700 font-bold text-sm bg-red-100 px-3 py-1 rounded-lg transition-colors",
              children: [
                /* @__PURE__ */ jsx(DollarSign, { size: 16 }),
                "Reducir Deuda"
              ]
            }
          )
        ] }) })
      ] }, user.id)) })
    ] }) }),
    !loading && selectedServer && users.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-center text-text-muted py-10", children: "No se encontraron usuarios en este servidor." }),
    scheduleModalUser && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-secondary-dark rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative border border-border", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setScheduleModalUser(null),
          className: "absolute top-4 right-4 text-text-muted hover:text-text-main transition-colors",
          children: /* @__PURE__ */ jsx(X, { size: 24 })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-xl font-bold mb-4 text-text-main", children: [
          "Horario de ",
          scheduleModalUser.nickname
        ] }),
        /* @__PURE__ */ jsx(
          ScheduleManager,
          {
            serverId: selectedServer,
            userId: scheduleModalUser.id,
            onSave: () => {
              fetchUsers();
            }
          }
        )
      ] })
    ] }) }),
    debtModalUser && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-secondary-dark rounded-xl shadow-2xl max-w-md w-full relative border border-border p-6", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setDebtModalUser(null),
          className: "absolute top-4 right-4 text-text-muted hover:text-text-main transition-colors",
          children: /* @__PURE__ */ jsx(X, { size: 24 })
        }
      ),
      /* @__PURE__ */ jsxs("h3", { className: "text-xl font-bold mb-4 text-text-main flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(DollarSign, { className: "text-red-500" }),
        "Reducir Deuda"
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "text-text-muted mb-4", children: [
        "Usuario: ",
        /* @__PURE__ */ jsx("span", { className: "font-bold text-text-main", children: debtModalUser.nickname }),
        /* @__PURE__ */ jsx("br", {}),
        "Deuda Actual: ",
        /* @__PURE__ */ jsxs("span", { className: "font-bold text-red-500", children: [
          debtModalUser.accumulated_debt,
          " hrs"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setDebtType("partial"),
              className: `flex-1 py-2 rounded-lg border ${debtType === "partial" ? "bg-primary text-white border-primary" : "bg-background text-text-main border-border"}`,
              children: "Parcial"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setDebtType("total"),
              className: `flex-1 py-2 rounded-lg border ${debtType === "total" ? "bg-primary text-white border-primary" : "bg-background text-text-main border-border"}`,
              children: "Total"
            }
          )
        ] }),
        debtType === "partial" && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-text-main mb-1", children: "Cantidad a reducir (horas)" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              value: debtAmount,
              onChange: (e) => setDebtAmount(e.target.value),
              className: "w-full p-2 bg-background border border-border rounded-lg text-text-main focus:ring-primary focus:border-primary",
              placeholder: "Ej: 5",
              min: "0",
              max: debtModalUser.accumulated_debt
            }
          )
        ] }),
        debtType === "total" && /* @__PURE__ */ jsxs("div", { className: "bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg flex items-start gap-2 text-yellow-700 dark:text-yellow-400 text-sm", children: [
          /* @__PURE__ */ jsx(AlertCircle, { size: 16, className: "mt-0.5 flex-shrink-0" }),
          /* @__PURE__ */ jsx("p", { children: "Se eliminará toda la deuda acumulada de este usuario." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2 mt-6", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setDebtModalUser(null),
              className: "px-4 py-2 text-text-muted hover:text-text-main transition-colors",
              children: "Cancelar"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleReduceDebt,
              className: "px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors font-bold",
              disabled: debtType === "partial" && (!debtAmount || parseFloat(debtAmount) <= 0),
              children: "Confirmar"
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}

const $$Astro = createAstro();
const $$Users = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Users;
  const user = await getUserFromSession(Astro2);
  if (!user) {
    return Astro2.redirect("/");
  }
  const adminServersQuery = `
  SELECT s.id, s.name
  FROM servers s
  JOIN user_servers us ON s.id = us.server_id
  WHERE us.user_id = $1 AND us.is_admin = true
`;
  const { rows: adminServers } = await db.query(adminServersQuery, [user.id]);
  if (adminServers.length === 0) {
    return Astro2.redirect("/dashboardIndex");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Gesti\xF3n de Usuarios" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-8 min-h-[calc(100vh-64px)]"> <h1 class="text-3xl font-lilita text-secondary-dark dark:text-primary mb-2 text-center transition-colors duration-300">
Panel de Administración
</h1> <p class="text-center text-text-muted mb-8">
Gestiona las horas asignadas a los usuarios de tus servidores.
</p> ${renderComponent($$result2, "AdminHoursManager", AdminHoursManager, { "client:load": true, "adminServers": adminServers, "client:component-hydration": "load", "client:component-path": "D:/Personal/Todo/Proyectos/Proyectos 2025/Shifu/ShifuWEB/src/components/AdminHoursManager", "client:component-export": "default" })} </div> ` })}`;
}, "D:/Personal/Todo/Proyectos/Proyectos 2025/Shifu/ShifuWEB/src/pages/admin/users.astro", void 0);

const $$file = "D:/Personal/Todo/Proyectos/Proyectos 2025/Shifu/ShifuWEB/src/pages/admin/users.astro";
const $$url = "/admin/users";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Users,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
