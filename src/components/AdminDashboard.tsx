import React, { useState, useEffect } from 'react';
import { Calendar, Clock, XCircle, CheckCircle, User, PlayCircle, Settings } from 'lucide-react';
import ShiftDetailModal from './ShiftDetailModal';
import TelegramSettings from './TelegramSettings';

interface Server {
  id: number | string;
  name: string;
  icon_url?: string;
}

interface AdminDashboardProps {
  adminServers: Server[];
}

export default function AdminDashboard({ adminServers }: AdminDashboardProps) {
  const [selectedServer, setSelectedServer] = useState<string>(adminServers.length > 0 ? String(adminServers[0].id) : "");
  const currentServer = adminServers.find(s => String(s.id) === selectedServer);
  
  // Filters
  const [timeRange, setTimeRange] = useState("week");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Data
  const [stats, setStats] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [activeShifts, setActiveShifts] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedShift, setSelectedShift] = useState<any>(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Actions
  const [actionModal, setActionModal] = useState<{type: 'close_shift' | 'end_break', id: number, name: string} | null>(null);
  const [observation, setObservation] = useState("");

  // Timer for UI updates
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Data
  const fetchData = () => {
    if (!selectedServer) return;
    setLoading(true);

    // Calculate dates based on range
    let start = new Date();
    let end = new Date();
    
    if (timeRange === 'custom') {
        if (customStart) start = new Date(customStart);
        if (customEnd) end = new Date(customEnd);
        // Adjust end date to end of day
        end.setHours(23, 59, 59, 999);
    } else {
        // Logic for presets
        const d = new Date();
        switch(timeRange) {
            case 'week': 
                const day = d.getDay() || 7; 
                if (day !== 1) d.setHours(-24 * (day - 1)); 
                else d.setHours(0,0,0,0);
                start = d;
                break;
            case 'fortnight': d.setDate(d.getDate() - 15); start = d; break;
            case 'month': d.setDate(1); start = d; break;
            case 'year': d.setMonth(0, 1); start = d; break;
        }
    }

    const userQuery = selectedUsers.length > 0 ? `&userIds=${selectedUsers.join(',')}` : '';
    const dateQuery = `&startDate=${start.toISOString()}&endDate=${end.toISOString()}`;

    // Fetch Stats & History
    fetch(`/api/admin/dashboard-stats?serverId=${selectedServer}${dateQuery}${userQuery}`)
      .then(res => res.json())
      .then(data => {
          setStats(data.stats);
          setHistory(data.history);
          setAllUsers(data.users);
          setLoading(false);
      })
      .catch(err => { console.error(err); setLoading(false); });

    // Fetch Active Shifts (Separate call to keep it fresh)
    fetchActiveShifts();
  };

  const fetchActiveShifts = () => {
      if (!selectedServer) return;
      fetch(`/api/admin/active-shifts?serverId=${selectedServer}`)
        .then(res => res.json())
        .then(data => setActiveShifts(data))
        .catch(console.error);
  };

  useEffect(() => {
      fetchData();
      // Poll active shifts every 30s
      const interval = setInterval(fetchActiveShifts, 30000);
      return () => clearInterval(interval);
  }, [selectedServer, timeRange, customStart, customEnd, selectedUsers]);


  const handleAction = async () => {
      if (!actionModal || !selectedServer) return;

      try {
          const res = await fetch('/api/admin/actions', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                  action: actionModal.type,
                  shiftId: actionModal.type === 'close_shift' ? actionModal.id : undefined,
                  breakId: actionModal.type === 'end_break' ? actionModal.id : undefined,
                  serverId: selectedServer,
                  observation: observation
              })
          });
          
          if (res.ok) {
              setActionModal(null);
              setObservation("");
              fetchData(); // Refresh all
          } else {
              alert("Error al ejecutar acción");
          }
      } catch (e) {
          console.error(e);
      }
  };

  const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  };

  const filteredUsersList = allUsers.filter(u => 
    u.nickname.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleUser = (id: string) => {
      if (selectedUsers.includes(id)) {
          setSelectedUsers(selectedUsers.filter(uid => uid !== id));
      } else {
          setSelectedUsers([...selectedUsers, id]);
      }
  };

  const [showTelegramSettings, setShowTelegramSettings] = useState(false);

  return (
    <div className="font-roboto space-y-6">
      
      {/* Top Bar: Server & Filters */}
      <div className="bg-white dark:bg-secondary-dark p-4 rounded-xl shadow-md border-l-4 border-primary-dark flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center transition-colors duration-300">
        <div className="w-full lg:w-auto flex items-center gap-3">
            {currentServer?.icon_url && (
                <img 
                    src={currentServer.icon_url} 
                    alt={currentServer.name} 
                    className="w-12 h-12 rounded-full border border-border-color shadow-sm"
                />
            )}
            <div className="flex-1">
                <label className="block text-xs font-bold text-text-muted uppercase mb-1">Servidor</label>
                <select 
                    value={selectedServer} 
                    onChange={(e) => setSelectedServer(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-background dark:bg-gray-800 font-bold text-text-main border-border-color focus:ring-2 focus:ring-primary outline-none"
                >
                    {adminServers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
            </div>
            
            <button
              onClick={() => setShowTelegramSettings(!showTelegramSettings)}
              className={`p-2 rounded-lg border transition-colors ${showTelegramSettings ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 text-blue-700 dark:text-blue-400' : 'bg-background dark:bg-gray-800 border-border-color text-text-muted hover:bg-secondary/10'}`}
              title="Configurar Notificaciones"
            >
              <Settings size={20} />
            </button>
        </div>

        <div className="flex flex-wrap gap-2 items-end w-full lg:w-auto">
            <div>
                <label className="block text-xs font-bold text-text-muted uppercase mb-1">Rango</label>
                <select 
                    value={timeRange} 
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="p-2 border rounded-lg bg-background dark:bg-gray-800 text-text-main border-border-color text-sm"
                >
                    <option value="week">Semana</option>
                    <option value="fortnight">Quincena</option>
                    <option value="month">Mes</option>
                    <option value="year">Año</option>
                    <option value="custom">Personalizado</option>
                </select>
            </div>

            {timeRange === 'custom' && (
                <>
                    <div>
                        <label className="block text-xs font-bold text-text-muted uppercase mb-1">Inicio</label>
                        <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)} className="p-2 border rounded-lg bg-background dark:bg-gray-800 text-text-main border-border-color text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-text-muted uppercase mb-1">Fin</label>
                        <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)} className="p-2 border rounded-lg bg-background dark:bg-gray-800 text-text-main border-border-color text-sm" />
                    </div>
                </>
            )}

            {/* User Filter Dropdown */}
            <div className="relative">
                <button 
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="p-2 border rounded-lg bg-background dark:bg-gray-800 text-text-main border-border-color text-sm flex items-center gap-2 hover:bg-secondary/10"
                >
                    <User size={16} />
                    {selectedUsers.length === 0 ? "Todos los usuarios" : `${selectedUsers.length} seleccionados`}
                </button>
                
                {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-secondary-dark border border-border-color rounded-lg shadow-xl z-50 p-2">
                        <div className="flex justify-between items-center mb-2">
                            <input 
                                type="text" 
                                placeholder="Buscar usuario..." 
                                className="w-full p-2 border rounded text-sm bg-background dark:bg-gray-800 text-text-main border-border-color"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                            <button onClick={() => setIsUserDropdownOpen(false)} className="ml-2 text-text-muted hover:text-text-main">
                                <XCircle size={16} />
                            </button>
                        </div>
                        <div className="max-h-48 overflow-y-auto space-y-1">
                            {filteredUsersList.map(u => (
                                <div key={u.id} onClick={() => toggleUser(u.id)} className="flex items-center gap-2 p-1 hover:bg-secondary/10 cursor-pointer rounded text-text-main">
                                    <div className={`w-4 h-4 border rounded flex items-center justify-center ${selectedUsers.includes(u.id) ? 'bg-primary border-primary' : 'border-border-color'}`}>
                                        {selectedUsers.includes(u.id) && <CheckCircle size={12} className="text-white" />}
                                    </div>
                                    <span className="text-sm truncate">{u.nickname}</span>
                                </div>
                            ))}
                        </div>
                        {selectedUsers.length > 0 && (
                            <button onClick={() => setSelectedUsers([])} className="w-full mt-2 text-xs text-red-500 hover:underline text-center">
                                Limpiar filtros
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Telegram Settings Panel */}
      {showTelegramSettings && selectedServer && (
        <TelegramSettings serverId={selectedServer} />
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-secondary-dark p-4 rounded-xl shadow border-t-4 border-green-500 transition-colors duration-300">
                <p className="text-text-muted text-xs font-bold uppercase">Total Horas Trabajadas</p>
                <h3 className="text-2xl font-bold text-text-main">{stats.totalWorkedHours.toFixed(2)}h</h3>
            </div>
            <div className="bg-white dark:bg-secondary-dark p-4 rounded-xl shadow border-t-4 border-yellow-500 transition-colors duration-300">
                <p className="text-text-muted text-xs font-bold uppercase">Total Horas Break</p>
                <h3 className="text-2xl font-bold text-text-main">{stats.totalBreakHours.toFixed(2)}h</h3>
            </div>
            <div className="bg-white dark:bg-secondary-dark p-4 rounded-xl shadow border-t-4 border-blue-500 transition-colors duration-300">
                <p className="text-text-muted text-xs font-bold uppercase">Turnos Totales</p>
                <h3 className="text-2xl font-bold text-text-main">{stats.totalShifts}</h3>
            </div>
            <div className="bg-white dark:bg-secondary-dark p-4 rounded-xl shadow border-t-4 border-purple-500 transition-colors duration-300">
                <p className="text-text-muted text-xs font-bold uppercase">Horas Extras (Total)</p>
                <h3 className="text-2xl font-bold text-text-main">
                  {/* Nota: El cálculo exacto de horas extras globales requiere sumar las extras individuales de cada usuario, 
                      pero como aproximación rápida podemos mostrar la diferencia si hay una meta global, 
                      o simplemente dejarlo pendiente si se requiere lógica compleja por usuario. 
                      Por ahora, mostraré un placeholder o cálculo simple si lo tuviéramos. */}
                   -
                </h3>
                <p className="text-xs text-text-muted">Ver detalle por usuario</p>
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Active Shifts Panel */}
          <div className="lg:col-span-1 space-y-4">
              <h3 className="text-xl font-lilita text-secondary-dark dark:text-primary flex items-center gap-2">
                  <PlayCircle className="text-green-500" /> Turnos Activos
              </h3>
              
              {activeShifts.length === 0 ? (
                  <div className="bg-white dark:bg-secondary-dark p-6 rounded-xl shadow text-center text-text-muted transition-colors duration-300">
                      No hay usuarios trabajando en este momento.
                  </div>
              ) : (
                  activeShifts.map(shift => {
                      const isOnBreak = !!shift.active_break;
                      const startTime = new Date(shift.start_time).getTime();
                      const breakStart = isOnBreak ? new Date(shift.active_break.break_start).getTime() : 0;
                      
                      const elapsed = Math.max(0, now - startTime);
                      const breakElapsed = isOnBreak ? Math.max(0, now - breakStart) : 0;

                      return (
                          <div key={shift.id} className={`bg-white dark:bg-secondary-dark p-4 rounded-xl shadow border-l-4 ${isOnBreak ? 'border-yellow-400' : 'border-green-500'} transition-colors duration-300`}>
                              <div className="flex justify-between items-start mb-2">
                                  <div>
                                      <h4 className="font-bold text-text-main">{shift.nickname}</h4>
                                      <p className="text-xs text-text-muted">@{shift.username}</p>
                                  </div>
                                  <span className={`px-2 py-1 rounded text-xs font-bold ${isOnBreak ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'}`}>
                                      {isOnBreak ? 'EN BREAK' : 'TRABAJANDO'}
                                  </span>
                              </div>

                              <div className="flex justify-between items-center mb-3">
                                  <div className="text-sm">
                                      <p className="text-text-muted text-xs">Tiempo Total</p>
                                      <p className="font-mono font-bold text-lg text-text-main">{formatDuration(elapsed)}</p>
                                  </div>
                                  {isOnBreak && (
                                      <div className="text-sm text-right">
                                          <p className="text-text-muted text-xs">Tiempo Break</p>
                                          <p className="font-mono font-bold text-lg text-yellow-600 dark:text-yellow-400">{formatDuration(breakElapsed)}</p>
                                      </div>
                                  )}
                              </div>

                              {isOnBreak && (
                                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded text-xs text-yellow-800 dark:text-yellow-300 mb-3 italic">
                                      Razón: {shift.active_break.reason}
                                  </div>
                              )}

                              <div className="flex gap-2">
                                  {isOnBreak ? (
                                      <button 
                                        onClick={() => setActionModal({type: 'end_break', id: shift.active_break.id, name: shift.nickname})}
                                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 rounded text-xs font-bold transition-colors"
                                      >
                                          Finalizar Break
                                      </button>
                                  ) : (
                                      <button 
                                        onClick={() => setActionModal({type: 'close_shift', id: shift.id, name: shift.nickname})}
                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-xs font-bold transition-colors"
                                      >
                                          Cerrar Turno
                                      </button>
                                  )}
                              </div>
                          </div>
                      );
                  })
              )}
          </div>

          {/* History Table */}
          <div className="lg:col-span-2">
              <h3 className="text-xl font-lilita text-secondary-dark dark:text-primary mb-4 flex items-center gap-2">
                  <Clock className="text-primary" /> Historial de Turnos
              </h3>
              
              <div className="bg-white dark:bg-secondary-dark rounded-xl shadow overflow-hidden transition-colors duration-300">
                  <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-border-color">
                          <thead className="bg-secondary-dark text-white">
                              <tr>
                                  <th className="px-4 py-3 text-left text-xs font-medium uppercase">Usuario</th>
                                  <th className="px-4 py-3 text-left text-xs font-medium uppercase">Fecha</th>
                                  <th className="px-4 py-3 text-left text-xs font-medium uppercase">Duración</th>
                                  <th className="px-4 py-3 text-left text-xs font-medium uppercase">Break</th>
                                  <th className="px-4 py-3 text-left text-xs font-medium uppercase">Estado</th>
                              </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-secondary-dark divide-y divide-border-color">
                              {history.length === 0 ? (
                                  <tr><td colSpan={5} className="p-4 text-center text-text-muted">No hay registros en este periodo.</td></tr>
                              ) : (
                                  history.map(h => (
                                      <tr 
                                        key={h.id} 
                                        onClick={() => setSelectedShift(h)}
                                        className="hover:bg-secondary/10 transition-colors cursor-pointer"
                                      >
                                          <td className="px-4 py-3 whitespace-nowrap">
                                              <div className="flex items-center gap-3">
                                                  <img 
                                                    src={h.avatar_url || "https://cdn.discordapp.com/embed/avatars/0.png"} 
                                                    alt={h.nickname} 
                                                    className="w-8 h-8 rounded-full border border-border-color"
                                                  />
                                                  <div className="text-sm font-medium text-text-main">{h.nickname}</div>
                                              </div>
                                          </td>
                                          <td className="px-4 py-3 whitespace-nowrap text-sm text-text-muted">
                                              {new Date(h.start_time).toLocaleDateString()} <br/>
                                              <span className="text-xs">{new Date(h.start_time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                          </td>
                                          <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-green-600 dark:text-green-400">
                                              {formatDuration(h.durationMs)}
                                          </td>
                                          <td className="px-4 py-3 whitespace-nowrap text-sm text-yellow-600 dark:text-yellow-400">
                                              {formatDuration(h.breakMs)}
                                          </td>
                                          <td className="px-4 py-3 whitespace-nowrap">
                                              {h.end_time ? (
                                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                                                      Finalizado
                                                  </span>
                                              ) : (
                                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 animate-pulse">
                                                      Activo
                                                  </span>
                                              )}
                                          </td>
                                      </tr>
                                  ))
                              )}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
      </div>

      <ShiftDetailModal 
        shift={selectedShift} 
        onClose={() => setSelectedShift(null)} 
      />

      {/* Action Modal */}
      {actionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-secondary-dark rounded-xl shadow-2xl max-w-md w-full p-6 border border-border-color">
                  <h3 className="text-xl font-bold mb-2 text-text-main">
                      {actionModal.type === 'close_shift' ? 'Cerrar Turno Forzosamente' : 'Finalizar Break Forzosamente'}
                  </h3>
                  <p className="text-text-muted mb-4">
                      Estás a punto de modificar el estado de <strong>{actionModal.name}</strong>.
                  </p>
                  
                  <label className="block text-sm font-medium text-text-main mb-2">Observación (Obligatorio)</label>
                  <textarea 
                      className="w-full border rounded-lg p-2 mb-4 bg-background dark:bg-gray-800 text-text-main border-border-color focus:ring-2 focus:ring-primary outline-none"
                      rows={3}
                      placeholder="Motivo del cierre..."
                      value={observation}
                      onChange={e => setObservation(e.target.value)}
                  ></textarea>

                  <div className="flex justify-end gap-2">
                      <button 
                          onClick={() => setActionModal(null)}
                          className="px-4 py-2 text-text-muted hover:bg-secondary/10 rounded-lg"
                      >
                          Cancelar
                      </button>
                      <button 
                          onClick={handleAction}
                          disabled={!observation.trim()}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                          Confirmar Acción
                      </button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
}
