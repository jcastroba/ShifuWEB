import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, AlertCircle, Loader2, Save, RefreshCw, Bell } from 'lucide-react';

interface TelegramSettingsProps {
  serverId: string;
}

export default function TelegramSettings({ serverId }: TelegramSettingsProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [checking, setChecking] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  
  // Form State
  const [botToken, setBotToken] = useState("");
  const [hasToken, setHasToken] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState<string | null>(null);
  
  // Alert Config
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
    fetch(`/api/admin/telegram-settings?serverId=${serverId}`)
      .then(res => res.json())
      .then(data => {
        if (data.server_id) {
          setHasToken(data.has_token);
          setChatId(data.telegram_chat_id);
          setVerificationCode(data.verification_code); // Si hay uno pendiente
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
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleSave = () => {
    setSaving(true);
    fetch('/api/admin/telegram-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serverId,
        telegramBotToken: botToken, // Solo se envía si el usuario lo escribió
        ...config
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setVerificationCode(data.verificationCode);
        setHasToken(true); // Asumimos que si guardó, ya tiene token (o mantuvo el anterior)
        setBotToken(""); // Limpiar input por seguridad
      }
      setSaving(false);
    })
    .catch(err => {
      console.error(err);
      setSaving(false);
    });
  };

  const checkLink = () => {
    setChecking(true);
    fetch('/api/admin/telegram-check-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serverId })
    })
    .then(res => res.json())
    .then(data => {
      if (data.linked) {
        setChatId(data.chatId);
        setVerificationCode(null);
      } else {
        alert("Aún no se detecta el mensaje en el grupo. Asegúrate de haber enviado el código.");
      }
      setChecking(false);
    })
    .catch(err => {
      console.error(err);
      setChecking(false);
    });
  };

  const sendTestMessage = () => {
    setSendingTest(true);
    fetch('/api/admin/telegram-test-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serverId })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Mensaje enviado correctamente. Revisa tu grupo de Telegram.");
      } else {
        alert("Error al enviar mensaje: " + (data.error || "Desconocido"));
      }
      setSendingTest(false);
    })
    .catch(err => {
      console.error(err);
      alert("Error de conexión");
      setSendingTest(false);
    });
  };

  if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-primary" /></div>;

  return (
    <div className="bg-white dark:bg-secondary-dark p-6 rounded-xl shadow-lg border border-border-color space-y-8 transition-colors duration-300">
      <div className="border-b border-border-color pb-4">
        <h2 className="text-2xl font-bold text-text-main flex items-center gap-2">
          <Send className="text-blue-500" /> Notificaciones de Telegram
        </h2>
        <p className="text-text-muted text-sm mt-1">
          Configura alertas automáticas para tu equipo.
        </p>
      </div>

      {/* Paso 1: Bot Token */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-text-main">1. Configuración del Bot</h3>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm text-blue-800 dark:text-blue-300">
          <p>1. Crea un bot en Telegram con <a href="https://telegram.me/BotFather" target="_blank" rel="noopener noreferrer" className="font-bold underline hover:text-blue-600 dark:hover:text-blue-400">@BotFather</a>.</p>
          <p>2. Copia el <strong>Token</strong> y pégalo aquí.</p>
          <p>3. Agrega tu bot al grupo donde quieres recibir las alertas.</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-main mb-1">Bot Token</label>
          <div className="flex gap-2">
            <input 
              type="password" 
              placeholder={hasToken ? "Token guardado (escribe para cambiar)" : "Pegar token aquí..."}
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              className="flex-1 p-2 border rounded-lg bg-background dark:bg-gray-800 text-text-main border-border-color focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Paso 2: Vinculación */}
      {hasToken && !chatId && (
        <div className="space-y-4 border-t border-border-color pt-6">
          <h3 className="font-bold text-lg text-text-main">2. Vincular Grupo</h3>
          
          {!verificationCode ? (
            <div className="text-center py-4">
              <p className="text-text-muted mb-4">Guarda la configuración para generar un código de vinculación.</p>
            </div>
          ) : (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-6 rounded-xl text-center space-y-4">
              <p className="text-yellow-800 dark:text-yellow-300 font-medium">Envía este mensaje a tu grupo de Telegram:</p>
              <div className="text-3xl font-mono font-bold text-text-main bg-white dark:bg-gray-800 p-4 rounded-lg border border-border-color inline-block select-all">
                /start {verificationCode}
              </div>
              <p className="text-xs text-text-muted">El bot debe estar en el grupo para leer el mensaje.</p>
              
              <button 
                onClick={checkLink}
                disabled={checking}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
              >
                {checking ? <Loader2 className="animate-spin w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                Verificar Vinculación
              </button>
            </div>
          )}
        </div>
      )}

      {/* Estado: Vinculado */}
      {chatId && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 p-4 rounded-lg flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-600 dark:text-green-400 w-6 h-6" />
            <div>
              <p className="font-bold text-green-800 dark:text-green-300">¡Grupo Vinculado Correctamente!</p>
              <p className="text-xs text-green-600 dark:text-green-400">Chat ID: {chatId}</p>
            </div>
          </div>
          <button 
            onClick={sendTestMessage}
            disabled={sendingTest}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
          >
            {sendingTest ? <Loader2 className="animate-spin w-4 h-4" /> : <Bell className="w-4 h-4" />}
            Probar Alerta
          </button>
        </div>
      )}

      {/* Paso 3: Preferencias */}
      <div className="space-y-4 border-t border-border-color pt-6">
        <h3 className="font-bold text-lg text-text-main">3. Preferencias de Alerta</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center gap-3 p-3 border border-border-color rounded-lg hover:bg-secondary/10 cursor-pointer">
            <input 
              type="checkbox" 
              checked={config.alertShiftStart}
              onChange={(e) => setConfig({...config, alertShiftStart: e.target.checked})}
              className="w-5 h-5 text-blue-600 rounded"
            />
            <span className="text-text-main">Inicio de Turno</span>
          </label>

          <label className="flex items-center gap-3 p-3 border border-border-color rounded-lg hover:bg-secondary/10 cursor-pointer">
            <input 
              type="checkbox" 
              checked={config.alertShiftEnd}
              onChange={(e) => setConfig({...config, alertShiftEnd: e.target.checked})}
              className="w-5 h-5 text-blue-600 rounded"
            />
            <span className="text-text-main">Fin de Turno</span>
          </label>

          <label className="flex items-center gap-3 p-3 border border-border-color rounded-lg hover:bg-secondary/10 cursor-pointer">
            <input 
              type="checkbox" 
              checked={config.alertBreakExceeded}
              onChange={(e) => setConfig({...config, alertBreakExceeded: e.target.checked})}
              className="w-5 h-5 text-blue-600 rounded"
            />
            <span className="text-text-main">Exceso de Break</span>
          </label>

          <label className="flex items-center gap-3 p-3 border border-border-color rounded-lg hover:bg-secondary/10 cursor-pointer">
            <input 
              type="checkbox" 
              checked={config.alertMissedSchedule}
              onChange={(e) => setConfig({...config, alertMissedSchedule: e.target.checked})}
              className="w-5 h-5 text-blue-600 rounded"
            />
            <span className="text-text-main">Falta Injustificada</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">Límite de Break (minutos)</label>
            <input 
              type="number" 
              value={config.maxBreakMinutes}
              onChange={(e) => setConfig({...config, maxBreakMinutes: parseInt(e.target.value)})}
              className="w-full p-2 border rounded-lg bg-background dark:bg-gray-800 text-text-main border-border-color"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">Tolerancia de Retardo (minutos)</label>
            <input 
              type="number" 
              value={config.scheduleGraceMinutes}
              onChange={(e) => setConfig({...config, scheduleGraceMinutes: parseInt(e.target.value)})}
              className="w-full p-2 border rounded-lg bg-background dark:bg-gray-800 text-text-main border-border-color"
            />
          </div>
        </div>
      </div>

      {/* Botón Guardar */}
      <div className="pt-6">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-primary-dark text-white py-3 rounded-xl font-bold hover:bg-primary-dark/90 transition-colors flex justify-center items-center gap-2"
        >
          {saving ? <Loader2 className="animate-spin" /> : <Save />}
          Guardar Configuración
        </button>
      </div>
    </div>
  );
}
