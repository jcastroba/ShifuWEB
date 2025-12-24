/* empty css                                        */
import { c as createComponent, a as createAstro, d as renderComponent, e as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_C_x741Bc.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_BUCrNJaf.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { Loader2, Send, RefreshCw, CheckCircle, Bell, Save, Settings, User, XCircle, PlayCircle, Clock } from 'lucide-react';
import { S as ShiftDetailModal } from '../../chunks/ShiftDetailModal_Br-4eOsB.mjs';
import { d as db } from '../../chunks/db_DSGnrivC.mjs';
import { g as getUserFromSession } from '../../chunks/auth_CSCHR02c.mjs';
export { renderers } from '../../renderers.mjs';

function TelegramSettings({ serverId }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [checking, setChecking] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [botToken, setBotToken] = useState("");
  const [hasToken, setHasToken] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [verificationCode, setVerificationCode] = useState(null);
  const [config, setConfig] = useState({
    alertShiftStart: true,
    alertShiftEnd: true,
    alertBreakExceeded: true,
    alertMissedSchedule: true,
    maxBreakMinutes: 15,
    scheduleGraceMinutes: 10
  });
  useEffect(() => {
    if (!serverId) return;
    loadSettings();
  }, [serverId]);
  const loadSettings = () => {
    setLoading(true);
    fetch(`/api/admin/telegram-settings?serverId=${serverId}`).then((res) => res.json()).then((data) => {
      if (data.server_id) {
        setHasToken(data.has_token);
        setChatId(data.telegram_chat_id);
        setVerificationCode(data.verification_code);
        setConfig({
          alertShiftStart: data.alert_shift_start,
          alertShiftEnd: data.alert_shift_end,
          alertBreakExceeded: data.alert_break_exceeded,
          alertMissedSchedule: data.alert_missed_schedule,
          maxBreakMinutes: data.max_break_minutes,
          scheduleGraceMinutes: data.schedule_grace_minutes
        });
      }
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setLoading(false);
    });
  };
  const handleSave = () => {
    setSaving(true);
    fetch("/api/admin/telegram-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serverId,
        telegramBotToken: botToken,
        // Solo se envía si el usuario lo escribió
        ...config
      })
    }).then((res) => res.json()).then((data) => {
      if (data.success) {
        setVerificationCode(data.verificationCode);
        setHasToken(true);
        setBotToken("");
      }
      setSaving(false);
    }).catch((err) => {
      console.error(err);
      setSaving(false);
    });
  };
  const checkLink = () => {
    setChecking(true);
    fetch("/api/admin/telegram-check-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serverId })
    }).then((res) => res.json()).then((data) => {
      if (data.linked) {
        setChatId(data.chatId);
        setVerificationCode(null);
      } else {
        alert("Aún no se detecta el mensaje en el grupo. Asegúrate de haber enviado el código.");
      }
      setChecking(false);
    }).catch((err) => {
      console.error(err);
      setChecking(false);
    });
  };
  const sendTestMessage = () => {
    setSendingTest(true);
    fetch("/api/admin/telegram-test-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serverId })
    }).then((res) => res.json()).then((data) => {
      if (data.success) {
        alert("Mensaje enviado correctamente. Revisa tu grupo de Telegram.");
      } else {
        alert("Error al enviar mensaje: " + (data.error || "Desconocido"));
      }
      setSendingTest(false);
    }).catch((err) => {
      console.error(err);
      alert("Error de conexión");
      setSendingTest(false);
    });
  };
  if (loading) return /* @__PURE__ */ jsx("div", { className: "p-10 text-center", children: /* @__PURE__ */ jsx(Loader2, { className: "animate-spin mx-auto text-primary" }) });
  return /* @__PURE__ */ jsxs("div", { className: "bg-surface dark:bg-secondary-dark p-6 rounded-xl shadow-lg border border-border-color space-y-8 transition-colors duration-300", children: [
    /* @__PURE__ */ jsxs("div", { className: "border-b border-border-color pb-4", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold text-text-main flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Send, { className: "text-blue-500" }),
        " Notificaciones de Telegram"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-text-muted text-sm mt-1", children: "Configura alertas automáticas para tu equipo." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg text-text-main", children: "1. Configuración del Bot" }),
      /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm text-blue-800 dark:text-blue-300", children: [
        /* @__PURE__ */ jsxs("p", { children: [
          "1. Crea un bot en Telegram con ",
          /* @__PURE__ */ jsx("a", { href: "https://telegram.me/BotFather", target: "_blank", rel: "noopener noreferrer", className: "font-bold underline hover:text-blue-600 dark:hover:text-blue-400", children: "@BotFather" }),
          "."
        ] }),
        /* @__PURE__ */ jsxs("p", { children: [
          "2. Copia el ",
          /* @__PURE__ */ jsx("strong", { children: "Token" }),
          " y pégalo aquí."
        ] }),
        /* @__PURE__ */ jsx("p", { children: "3. Agrega tu bot al grupo donde quieres recibir las alertas." })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-text-main mb-1", children: "Bot Token" }),
        /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "password",
            placeholder: hasToken ? "Token guardado (escribe para cambiar)" : "Pegar token aquí...",
            value: botToken,
            onChange: (e) => setBotToken(e.target.value),
            className: "flex-1 p-2 border rounded-lg bg-background dark:bg-gray-800 text-text-main border-border-color focus:ring-2 focus:ring-blue-500 outline-none"
          }
        ) })
      ] })
    ] }),
    hasToken && !chatId && /* @__PURE__ */ jsxs("div", { className: "space-y-4 border-t border-border-color pt-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg text-text-main", children: "2. Vincular Grupo" }),
      !verificationCode ? /* @__PURE__ */ jsx("div", { className: "text-center py-4", children: /* @__PURE__ */ jsx("p", { className: "text-text-muted mb-4", children: "Guarda la configuración para generar un código de vinculación." }) }) : /* @__PURE__ */ jsxs("div", { className: "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-6 rounded-xl text-center space-y-4", children: [
        /* @__PURE__ */ jsx("p", { className: "text-yellow-800 dark:text-yellow-300 font-medium", children: "Envía este mensaje a tu grupo de Telegram:" }),
        /* @__PURE__ */ jsxs("div", { className: "text-3xl font-mono font-bold text-text-main bg-surface dark:bg-gray-800 p-4 rounded-lg border border-border-color inline-block select-all", children: [
          "/start ",
          verificationCode
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-text-muted", children: "El bot debe estar en el grupo para leer el mensaje." }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: checkLink,
            disabled: checking,
            className: "bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto",
            children: [
              checking ? /* @__PURE__ */ jsx(Loader2, { className: "animate-spin w-4 h-4" }) : /* @__PURE__ */ jsx(RefreshCw, { className: "w-4 h-4" }),
              "Verificar Vinculación"
            ]
          }
        )
      ] })
    ] }),
    chatId && /* @__PURE__ */ jsxs("div", { className: "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 p-4 rounded-lg flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(CheckCircle, { className: "text-green-600 dark:text-green-400 w-6 h-6" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "font-bold text-green-800 dark:text-green-300", children: "¡Grupo Vinculado Correctamente!" }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-green-600 dark:text-green-400", children: [
            "Chat ID: ",
            chatId
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: sendTestMessage,
          disabled: sendingTest,
          className: "bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm",
          children: [
            sendingTest ? /* @__PURE__ */ jsx(Loader2, { className: "animate-spin w-4 h-4" }) : /* @__PURE__ */ jsx(Bell, { className: "w-4 h-4" }),
            "Probar Alerta"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4 border-t border-border-color pt-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg text-text-main", children: "3. Preferencias de Alerta" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 p-3 border border-border-color rounded-lg hover:bg-secondary/10 cursor-pointer", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: config.alertShiftStart,
              onChange: (e) => setConfig({ ...config, alertShiftStart: e.target.checked }),
              className: "w-5 h-5 text-blue-600 rounded"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-text-main", children: "Inicio de Turno" })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 p-3 border border-border-color rounded-lg hover:bg-secondary/10 cursor-pointer", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: config.alertShiftEnd,
              onChange: (e) => setConfig({ ...config, alertShiftEnd: e.target.checked }),
              className: "w-5 h-5 text-blue-600 rounded"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-text-main", children: "Fin de Turno" })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 p-3 border border-border-color rounded-lg hover:bg-secondary/10 cursor-pointer", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: config.alertBreakExceeded,
              onChange: (e) => setConfig({ ...config, alertBreakExceeded: e.target.checked }),
              className: "w-5 h-5 text-blue-600 rounded"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-text-main", children: "Exceso de Break" })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-3 p-3 border border-border-color rounded-lg hover:bg-secondary/10 cursor-pointer", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: config.alertMissedSchedule,
              onChange: (e) => setConfig({ ...config, alertMissedSchedule: e.target.checked }),
              className: "w-5 h-5 text-blue-600 rounded"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-text-main", children: "Falta Injustificada" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mt-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-text-main mb-1", children: "Límite de Break (minutos)" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              value: config.maxBreakMinutes,
              onChange: (e) => setConfig({ ...config, maxBreakMinutes: parseInt(e.target.value) }),
              className: "w-full p-2 border rounded-lg bg-background dark:bg-gray-800 text-text-main border-border-color"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-text-main mb-1", children: "Tolerancia de Retardo (minutos)" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              value: config.scheduleGraceMinutes,
              onChange: (e) => setConfig({ ...config, scheduleGraceMinutes: parseInt(e.target.value) }),
              className: "w-full p-2 border rounded-lg bg-background dark:bg-gray-800 text-text-main border-border-color"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "pt-6", children: /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: handleSave,
        disabled: saving,
        className: "w-full bg-primary-dark text-white py-3 rounded-xl font-bold hover:bg-primary-dark/90 transition-colors flex justify-center items-center gap-2",
        children: [
          saving ? /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }) : /* @__PURE__ */ jsx(Save, {}),
          "Guardar Configuración"
        ]
      }
    ) })
  ] });
}

function AdminDashboard({ adminServers }) {
  const [selectedServer, setSelectedServer] = useState(adminServers.length > 0 ? String(adminServers[0].id) : "");
  const currentServer = adminServers.find((s) => String(s.id) === selectedServer);
  const [timeRange, setTimeRange] = useState("week");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeShifts, setActiveShifts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [actionModal, setActionModal] = useState(null);
  const [observation, setObservation] = useState("");
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1e3);
    return () => clearInterval(interval);
  }, []);
  const fetchData = () => {
    if (!selectedServer) return;
    setLoading(true);
    let start = /* @__PURE__ */ new Date();
    let end = /* @__PURE__ */ new Date();
    if (timeRange === "custom") {
      if (customStart) start = new Date(customStart);
      if (customEnd) end = new Date(customEnd);
      end.setHours(23, 59, 59, 999);
    } else {
      const d = /* @__PURE__ */ new Date();
      switch (timeRange) {
        case "week":
          const day = d.getDay() || 7;
          if (day !== 1) d.setHours(-24 * (day - 1));
          else d.setHours(0, 0, 0, 0);
          start = d;
          break;
        case "fortnight":
          d.setDate(d.getDate() - 15);
          start = d;
          break;
        case "month":
          d.setDate(1);
          start = d;
          break;
        case "year":
          d.setMonth(0, 1);
          start = d;
          break;
      }
    }
    const userQuery = selectedUsers.length > 0 ? `&userIds=${selectedUsers.join(",")}` : "";
    const dateQuery = `&startDate=${start.toISOString()}&endDate=${end.toISOString()}`;
    fetch(`/api/admin/dashboard-stats?serverId=${selectedServer}${dateQuery}${userQuery}`).then((res) => res.json()).then((data) => {
      setStats(data.stats);
      setHistory(data.history);
      setAllUsers(data.users);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setLoading(false);
    });
    fetchActiveShifts();
  };
  const fetchActiveShifts = () => {
    if (!selectedServer) return;
    fetch(`/api/admin/active-shifts?serverId=${selectedServer}`).then((res) => res.json()).then((data) => setActiveShifts(data)).catch(console.error);
  };
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchActiveShifts, 3e4);
    return () => clearInterval(interval);
  }, [selectedServer, timeRange, customStart, customEnd, selectedUsers]);
  const handleAction = async () => {
    if (!actionModal || !selectedServer) return;
    try {
      const res = await fetch("/api/admin/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: actionModal.type,
          shiftId: actionModal.type === "close_shift" ? actionModal.id : void 0,
          breakId: actionModal.type === "end_break" ? actionModal.id : void 0,
          serverId: selectedServer,
          observation
        })
      });
      if (res.ok) {
        setActionModal(null);
        setObservation("");
        fetchData();
      } else {
        alert("Error al ejecutar acción");
      }
    } catch (e) {
      console.error(e);
    }
  };
  const formatDuration = (ms) => {
    const totalSeconds = Math.floor(ms / 1e3);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor(totalSeconds % 3600 / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };
  const filteredUsersList = allUsers.filter(
    (u) => u.nickname.toLowerCase().includes(searchTerm.toLowerCase()) || u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const toggleUser = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((uid) => uid !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };
  const [showTelegramSettings, setShowTelegramSettings] = useState(false);
  return /* @__PURE__ */ jsxs("div", { className: "font-roboto space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-surface dark:bg-secondary-dark p-4 rounded-xl shadow-md border-l-4 border-primary-dark flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center transition-colors duration-300", children: [
      /* @__PURE__ */ jsxs("div", { className: "w-full lg:w-auto flex items-center gap-3", children: [
        currentServer?.icon_url && /* @__PURE__ */ jsx(
          "img",
          {
            src: currentServer.icon_url,
            alt: currentServer.name,
            className: "w-12 h-12 rounded-full border border-border-color shadow-sm"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-text-muted uppercase mb-1", children: "Servidor" }),
          /* @__PURE__ */ jsx(
            "select",
            {
              value: selectedServer,
              onChange: (e) => setSelectedServer(e.target.value),
              className: "w-full p-2 border rounded-lg bg-background dark:bg-gray-800 font-bold text-text-main border-border-color focus:ring-2 focus:ring-primary outline-none",
              children: adminServers.map((s) => /* @__PURE__ */ jsx("option", { value: s.id, children: s.name }, s.id))
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowTelegramSettings(!showTelegramSettings),
            className: `p-2 rounded-lg border transition-colors ${showTelegramSettings ? "bg-blue-100 dark:bg-blue-900/30 border-blue-300 text-blue-700 dark:text-blue-400" : "bg-background dark:bg-gray-800 border-border-color text-text-muted hover:bg-secondary/10"}`,
            title: "Configurar Notificaciones",
            children: /* @__PURE__ */ jsx(Settings, { size: 20 })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 items-end w-full lg:w-auto", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-text-muted uppercase mb-1", children: "Rango" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: timeRange,
              onChange: (e) => setTimeRange(e.target.value),
              className: "p-2 border rounded-lg bg-background dark:bg-gray-800 text-text-main border-border-color text-sm",
              children: [
                /* @__PURE__ */ jsx("option", { value: "week", children: "Semana" }),
                /* @__PURE__ */ jsx("option", { value: "fortnight", children: "Quincena" }),
                /* @__PURE__ */ jsx("option", { value: "month", children: "Mes" }),
                /* @__PURE__ */ jsx("option", { value: "year", children: "Año" }),
                /* @__PURE__ */ jsx("option", { value: "custom", children: "Personalizado" })
              ]
            }
          )
        ] }),
        timeRange === "custom" && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-text-muted uppercase mb-1", children: "Inicio" }),
            /* @__PURE__ */ jsx("input", { type: "date", value: customStart, onChange: (e) => setCustomStart(e.target.value), className: "p-2 border rounded-lg bg-background dark:bg-gray-800 text-text-main border-border-color text-sm" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs font-bold text-text-muted uppercase mb-1", children: "Fin" }),
            /* @__PURE__ */ jsx("input", { type: "date", value: customEnd, onChange: (e) => setCustomEnd(e.target.value), className: "p-2 border rounded-lg bg-background dark:bg-gray-800 text-text-main border-border-color text-sm" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setIsUserDropdownOpen(!isUserDropdownOpen),
              className: "p-2 border rounded-lg bg-background dark:bg-gray-800 text-text-main border-border-color text-sm flex items-center gap-2 hover:bg-secondary/10",
              children: [
                /* @__PURE__ */ jsx(User, { size: 16 }),
                selectedUsers.length === 0 ? "Todos los usuarios" : `${selectedUsers.length} seleccionados`
              ]
            }
          ),
          isUserDropdownOpen && /* @__PURE__ */ jsxs("div", { className: "absolute right-0 mt-2 w-64 bg-surface dark:bg-secondary-dark border border-border-color rounded-lg shadow-xl z-50 p-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-2", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  placeholder: "Buscar usuario...",
                  className: "w-full p-2 border rounded text-sm bg-background dark:bg-gray-800 text-text-main border-border-color",
                  value: searchTerm,
                  onChange: (e) => setSearchTerm(e.target.value)
                }
              ),
              /* @__PURE__ */ jsx("button", { onClick: () => setIsUserDropdownOpen(false), className: "ml-2 text-text-muted hover:text-text-main", children: /* @__PURE__ */ jsx(XCircle, { size: 16 }) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "max-h-48 overflow-y-auto space-y-1", children: filteredUsersList.map((u) => /* @__PURE__ */ jsxs("div", { onClick: () => toggleUser(u.id), className: "flex items-center gap-2 p-1 hover:bg-secondary/10 cursor-pointer rounded text-text-main", children: [
              /* @__PURE__ */ jsx("div", { className: `w-4 h-4 border rounded flex items-center justify-center ${selectedUsers.includes(u.id) ? "bg-primary border-primary" : "border-border-color"}`, children: selectedUsers.includes(u.id) && /* @__PURE__ */ jsx(CheckCircle, { size: 12, className: "text-white" }) }),
              /* @__PURE__ */ jsx("span", { className: "text-sm truncate", children: u.nickname })
            ] }, u.id)) }),
            selectedUsers.length > 0 && /* @__PURE__ */ jsx("button", { onClick: () => setSelectedUsers([]), className: "w-full mt-2 text-xs text-red-500 hover:underline text-center", children: "Limpiar filtros" })
          ] })
        ] })
      ] })
    ] }),
    showTelegramSettings && selectedServer && /* @__PURE__ */ jsx(TelegramSettings, { serverId: selectedServer }),
    stats && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-surface dark:bg-secondary-dark p-4 rounded-xl shadow border-t-4 border-green-500 transition-colors duration-300", children: [
        /* @__PURE__ */ jsx("p", { className: "text-text-muted text-xs font-bold uppercase", children: "Total Horas Trabajadas" }),
        /* @__PURE__ */ jsxs("h3", { className: "text-2xl font-bold text-text-main", children: [
          stats.totalWorkedHours.toFixed(2),
          "h"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-surface dark:bg-secondary-dark p-4 rounded-xl shadow border-t-4 border-yellow-500 transition-colors duration-300", children: [
        /* @__PURE__ */ jsx("p", { className: "text-text-muted text-xs font-bold uppercase", children: "Total Horas Break" }),
        /* @__PURE__ */ jsxs("h3", { className: "text-2xl font-bold text-text-main", children: [
          stats.totalBreakHours.toFixed(2),
          "h"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-surface dark:bg-secondary-dark p-4 rounded-xl shadow border-t-4 border-blue-500 transition-colors duration-300", children: [
        /* @__PURE__ */ jsx("p", { className: "text-text-muted text-xs font-bold uppercase", children: "Turnos Totales" }),
        /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-text-main", children: stats.totalShifts })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-surface dark:bg-secondary-dark p-4 rounded-xl shadow border-t-4 border-purple-500 transition-colors duration-300", children: [
        /* @__PURE__ */ jsx("p", { className: "text-text-muted text-xs font-bold uppercase", children: "Horas Extras (Total)" }),
        /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-text-main", children: "-" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-text-muted", children: "Ver detalle por usuario" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-1 space-y-4", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-xl font-lilita text-secondary-dark dark:text-primary flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(PlayCircle, { className: "text-green-500" }),
          " Turnos Activos"
        ] }),
        activeShifts.length === 0 ? /* @__PURE__ */ jsx("div", { className: "bg-surface dark:bg-secondary-dark p-6 rounded-xl shadow text-center text-text-muted transition-colors duration-300", children: "No hay usuarios trabajando en este momento." }) : activeShifts.map((shift) => {
          const isOnBreak = !!shift.active_break;
          const startTime = new Date(shift.start_time).getTime();
          const breakStart = isOnBreak ? new Date(shift.active_break.break_start).getTime() : 0;
          const elapsed = Math.max(0, now - startTime);
          const breakElapsed = isOnBreak ? Math.max(0, now - breakStart) : 0;
          return /* @__PURE__ */ jsxs("div", { className: `bg-surface dark:bg-secondary-dark p-4 rounded-xl shadow border-l-4 ${isOnBreak ? "border-yellow-400" : "border-green-500"} transition-colors duration-300`, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "font-bold text-text-main", children: shift.nickname }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-text-muted", children: [
                  "@",
                  shift.username
                ] })
              ] }),
              /* @__PURE__ */ jsx("span", { className: `px-2 py-1 rounded text-xs font-bold ${isOnBreak ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400" : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"}`, children: isOnBreak ? "EN BREAK" : "TRABAJANDO" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-sm", children: [
                /* @__PURE__ */ jsx("p", { className: "text-text-muted text-xs", children: "Tiempo Total" }),
                /* @__PURE__ */ jsx("p", { className: "font-mono font-bold text-lg text-text-main", children: formatDuration(elapsed) })
              ] }),
              isOnBreak && /* @__PURE__ */ jsxs("div", { className: "text-sm text-right", children: [
                /* @__PURE__ */ jsx("p", { className: "text-text-muted text-xs", children: "Tiempo Break" }),
                /* @__PURE__ */ jsx("p", { className: "font-mono font-bold text-lg text-yellow-600 dark:text-yellow-400", children: formatDuration(breakElapsed) })
              ] })
            ] }),
            isOnBreak && /* @__PURE__ */ jsxs("div", { className: "bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded text-xs text-yellow-800 dark:text-yellow-300 mb-3 italic", children: [
              "Razón: ",
              shift.active_break.reason
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: isOnBreak ? /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setActionModal({ type: "end_break", id: shift.active_break.id, name: shift.nickname }),
                className: "flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 rounded text-xs font-bold transition-colors",
                children: "Finalizar Break"
              }
            ) : /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setActionModal({ type: "close_shift", id: shift.id, name: shift.nickname }),
                className: "flex-1 bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-xs font-bold transition-colors",
                children: "Cerrar Turno"
              }
            ) })
          ] }, shift.id);
        })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2", children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-xl font-lilita text-secondary-dark dark:text-primary mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Clock, { className: "text-primary" }),
          " Historial de Turnos"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "bg-surface dark:bg-secondary-dark rounded-xl shadow overflow-hidden transition-colors duration-300", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full divide-y divide-border-color", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-secondary-dark text-white", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-xs font-medium uppercase", children: "Usuario" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-xs font-medium uppercase", children: "Fecha" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-xs font-medium uppercase", children: "Duración" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-xs font-medium uppercase", children: "Break" }),
            /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left text-xs font-medium uppercase", children: "Estado" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "bg-surface dark:bg-secondary-dark divide-y divide-border-color", children: history.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 5, className: "p-4 text-center text-text-muted", children: "No hay registros en este periodo." }) }) : history.map((h) => /* @__PURE__ */ jsxs(
            "tr",
            {
              onClick: () => setSelectedShift(h),
              className: "hover:bg-secondary/10 transition-colors cursor-pointer",
              children: [
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 whitespace-nowrap", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: h.avatar_url || "https://cdn.discordapp.com/embed/avatars/0.png",
                      alt: h.nickname,
                      className: "w-8 h-8 rounded-full border border-border-color"
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-text-main", children: h.nickname })
                ] }) }),
                /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 whitespace-nowrap text-sm text-text-muted", children: [
                  new Date(h.start_time).toLocaleDateString(),
                  " ",
                  /* @__PURE__ */ jsx("br", {}),
                  /* @__PURE__ */ jsx("span", { className: "text-xs", children: new Date(h.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) })
                ] }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 whitespace-nowrap text-sm font-bold text-green-600 dark:text-green-400", children: formatDuration(h.durationMs) }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 whitespace-nowrap text-sm text-yellow-600 dark:text-yellow-400", children: formatDuration(h.breakMs) }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 whitespace-nowrap", children: h.end_time ? /* @__PURE__ */ jsx("span", { className: "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200", children: "Finalizado" }) : /* @__PURE__ */ jsx("span", { className: "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 animate-pulse", children: "Activo" }) })
              ]
            },
            h.id
          )) })
        ] }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      ShiftDetailModal,
      {
        shift: selectedShift,
        onClose: () => setSelectedShift(null)
      }
    ),
    actionModal && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-surface dark:bg-secondary-dark rounded-xl shadow-2xl max-w-md w-full p-6 border border-border-color", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mb-2 text-text-main", children: actionModal.type === "close_shift" ? "Cerrar Turno Forzosamente" : "Finalizar Break Forzosamente" }),
      /* @__PURE__ */ jsxs("p", { className: "text-text-muted mb-4", children: [
        "Estás a punto de modificar el estado de ",
        /* @__PURE__ */ jsx("strong", { children: actionModal.name }),
        "."
      ] }),
      /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-text-main mb-2", children: "Observación (Obligatorio)" }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          className: "w-full border rounded-lg p-2 mb-4 bg-background dark:bg-gray-800 text-text-main border-border-color focus:ring-2 focus:ring-primary outline-none",
          rows: 3,
          placeholder: "Motivo del cierre...",
          value: observation,
          onChange: (e) => setObservation(e.target.value)
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActionModal(null),
            className: "px-4 py-2 text-text-muted hover:bg-secondary/10 rounded-lg",
            children: "Cancelar"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleAction,
            disabled: !observation.trim(),
            className: "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed",
            children: "Confirmar Acción"
          }
        )
      ] })
    ] }) })
  ] });
}

const $$Astro = createAstro();
const $$Dashboard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Dashboard;
  const user = await getUserFromSession(Astro2);
  if (!user) {
    return Astro2.redirect("/");
  }
  const adminServersQuery = `
  SELECT s.id, s.name, s.icon_url
  FROM servers s
  JOIN user_servers us ON s.id = us.server_id
  WHERE us.user_id = $1 AND us.is_admin = true
`;
  const { rows: adminServers } = await db.query(adminServersQuery, [user.id]);
  if (adminServers.length === 0) {
    return Astro2.redirect("/dashboardIndex");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Dashboard Administrativo" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4 py-8 min-h-[calc(100vh-64px)]"> <h1 class="text-3xl font-lilita text-secondary-dark dark:text-primary mb-2 text-center transition-colors duration-300">
Dashboard Administrativo
</h1> <p class="text-center text-text-muted mb-8">
Supervisión en tiempo real y reportes históricos.
</p> ${renderComponent($$result2, "AdminDashboard", AdminDashboard, { "client:load": true, "adminServers": adminServers, "client:component-hydration": "load", "client:component-path": "D:/Personal/Todo/Proyectos/Proyectos 2025/Shifu/ShifuWEB/src/components/AdminDashboard", "client:component-export": "default" })} </div> ` })}`;
}, "D:/Personal/Todo/Proyectos/Proyectos 2025/Shifu/ShifuWEB/src/pages/admin/dashboard.astro", void 0);

const $$file = "D:/Personal/Todo/Proyectos/Proyectos 2025/Shifu/ShifuWEB/src/pages/admin/dashboard.astro";
const $$url = "/admin/dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Dashboard,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
