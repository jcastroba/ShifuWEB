import { jsx, jsxs } from 'react/jsx-runtime';
import 'react';
import { X, Calendar, Clock, Coffee, AlignLeft } from 'lucide-react';

function ShiftDetailModal({ shift, onClose }) {
  if (!shift) return null;
  const formatDateTime = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };
  const formatDuration = (ms) => {
    if (!ms) return "00:00:00";
    const totalSeconds = Math.floor(ms / 1e3);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor(totalSeconds % 3600 / 60);
    const s = totalSeconds % 60;
    return `${h}h ${m}m ${s}s`;
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 font-roboto", children: /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-secondary-dark rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in transition-colors duration-300", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-secondary-dark text-white p-6 flex justify-between items-start sticky top-0 z-10", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-lilita", children: "Detalle del Turno" }),
        shift.nickname && /* @__PURE__ */ jsxs("p", { className: "text-gray-300 text-sm mt-1", children: [
          "Usuario: ",
          /* @__PURE__ */ jsx("span", { className: "font-bold text-white", children: shift.nickname }),
          " (@",
          shift.username,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "text-gray-300 hover:text-white transition-colors", children: /* @__PURE__ */ jsx(X, { size: 24 }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-background dark:bg-gray-800 p-4 rounded-lg border border-border-color", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-primary-dark dark:text-primary mb-2", children: [
            /* @__PURE__ */ jsx(Calendar, { size: 20 }),
            /* @__PURE__ */ jsx("h3", { className: "font-bold", children: "Inicio" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-text-main font-mono", children: formatDateTime(shift.start_time) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-background dark:bg-gray-800 p-4 rounded-lg border border-border-color", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-primary-dark dark:text-primary mb-2", children: [
            /* @__PURE__ */ jsx(Clock, { size: 20 }),
            /* @__PURE__ */ jsx("h3", { className: "font-bold", children: "Fin" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-text-main font-mono", children: shift.end_time ? formatDateTime(shift.end_time) : /* @__PURE__ */ jsx("span", { className: "text-green-600 dark:text-green-400 font-bold", children: "En Curso" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-background dark:bg-gray-800 p-4 rounded-lg border border-border-color", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-green-600 dark:text-green-400 mb-2", children: [
            /* @__PURE__ */ jsx(Clock, { size: 20 }),
            /* @__PURE__ */ jsx("h3", { className: "font-bold", children: "Tiempo Trabajado" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-text-main font-mono font-bold text-lg", children: formatDuration(shift.durationMs || 0) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-background dark:bg-gray-800 p-4 rounded-lg border border-border-color", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-yellow-600 dark:text-yellow-400 mb-2", children: [
            /* @__PURE__ */ jsx(Coffee, { size: 20 }),
            /* @__PURE__ */ jsx("h3", { className: "font-bold", children: "Tiempo en Break" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-text-main font-mono font-bold text-lg", children: formatDuration(shift.breakMs || 0) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "border-t border-border-color pt-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-text-main mb-3", children: [
          /* @__PURE__ */ jsx(AlignLeft, { size: 20 }),
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg", children: "Observaciones" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "bg-background dark:bg-gray-800 p-4 rounded-lg border border-border-color min-h-[80px]", children: shift.observations ? /* @__PURE__ */ jsx("p", { className: "text-text-main whitespace-pre-wrap", children: shift.observations }) : /* @__PURE__ */ jsx("p", { className: "text-text-muted italic", children: "Sin observaciones registradas." }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "border-t border-border-color pt-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-text-main mb-3", children: [
          /* @__PURE__ */ jsx(Coffee, { size: 20 }),
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg", children: "Historial de Breaks" })
        ] }),
        !shift.breaks || shift.breaks.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-text-muted italic", children: "No se registraron breaks en este turno." }) : /* @__PURE__ */ jsx("div", { className: "space-y-3", children: shift.breaks.map((b, index) => {
          const start = new Date(b.break_start).getTime();
          const end = b.break_end ? new Date(b.break_end).getTime() : Date.now();
          const duration = end - start;
          return /* @__PURE__ */ jsxs("div", { className: "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-2", children: [
              /* @__PURE__ */ jsxs("span", { className: "font-bold text-yellow-800 dark:text-yellow-300 text-sm", children: [
                "Break #",
                index + 1
              ] }),
              /* @__PURE__ */ jsx("span", { className: "bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 text-xs px-2 py-1 rounded-full font-mono", children: formatDuration(duration) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2 text-sm text-text-muted mb-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Inicio:" }),
                " ",
                new Date(b.break_start).toLocaleTimeString()
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Fin:" }),
                " ",
                b.break_end ? new Date(b.break_end).toLocaleTimeString() : "En curso"
              ] })
            ] }),
            b.reason && /* @__PURE__ */ jsxs("div", { className: "text-sm text-text-main bg-white dark:bg-gray-800 p-2 rounded border border-yellow-100 dark:border-yellow-800", children: [
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-yellow-700 dark:text-yellow-400", children: "Razón:" }),
              " ",
              b.reason
            ] })
          ] }, index);
        }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "p-6 border-t border-border-color bg-background dark:bg-gray-800 rounded-b-xl flex justify-end", children: /* @__PURE__ */ jsx(
      "button",
      {
        onClick: onClose,
        className: "px-6 py-2 bg-secondary-dark text-white rounded-lg hover:bg-gray-800 transition-colors font-bold",
        children: "Cerrar"
      }
    ) })
  ] }) });
}

export { ShiftDetailModal as S };
