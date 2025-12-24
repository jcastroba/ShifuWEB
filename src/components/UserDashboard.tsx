import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Clock, Calendar, AlertCircle, CheckCircle, History } from 'lucide-react';
import ShiftDetailModal from './ShiftDetailModal';

interface Server {
  id: number | string;
  name: string;
  icon_url?: string;
}

interface DashboardProps {
  userServers: Server[];
}

export default function UserDashboard({ userServers }: DashboardProps) {
  const [selectedServer, setSelectedServer] = useState<string>(userServers.length > 0 ? String(userServers[0].id) : "");
  const [timeRange, setTimeRange] = useState("week");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedShift, setSelectedShift] = useState<any>(null);

  const currentServer = userServers.find(s => String(s.id) === selectedServer);

  useEffect(() => {
    if (!selectedServer) return;
    
    setLoading(true);
    fetch(`/api/user-stats?serverId=${selectedServer}&range=${timeRange}`)
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedServer, timeRange]);

  if (userServers.length === 0) {
    return (
      <div className="text-center p-10 text-text-muted">
        No perteneces a ningún servidor registrado.
      </div>
    );
  }

  const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatHours = (hours: number) => {
      return hours.toFixed(2) + 'h';
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6 font-roboto">
      {/* Header & Controls */}
      <div className="bg-white dark:bg-secondary-dark rounded-xl shadow-lg p-6 flex flex-col md:flex-row justify-between items-center gap-4 border-l-4 border-primary-dark transition-colors duration-300">
        <div>
          <h2 className="text-2xl font-lilita text-secondary-dark dark:text-primary">Mi Panel de Control</h2>
          <p className="text-text-muted text-sm">Resumen de actividad y horas</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto items-center">
          {currentServer?.icon_url && (
            <img 
              src={currentServer.icon_url} 
              alt={currentServer.name} 
              className="w-10 h-10 rounded-full border border-border-color shadow-sm"
            />
          )}
          <select 
            value={selectedServer} 
            onChange={(e) => setSelectedServer(e.target.value)}
            className="p-2 border rounded-lg bg-background dark:bg-gray-800 border-border-color text-text-main focus:ring-2 focus:ring-primary outline-none flex-1"
          >
            {userServers.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="p-2 border rounded-lg bg-background dark:bg-gray-800 border-border-color text-text-main focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="day">Hoy</option>
            <option value="week">Esta Semana</option>
            <option value="fortnight">Últimos 15 días</option>
            <option value="month">Este Mes</option>
            <option value="year">Este Año</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-dark mx-auto"></div>
            <p className="mt-4 text-text-muted">Cargando datos...</p>
        </div>
      ) : data ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-secondary-dark p-6 rounded-xl shadow-md border-t-4 border-blue-500 transition-colors duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-text-muted text-sm font-medium">Horas Asignadas</p>
                  <h3 className="text-3xl font-bold text-text-main mt-1">{data.stats.assignedHours}h</h3>
                </div>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                  <Calendar size={24} />
                </div>
              </div>
              <p className="text-xs text-text-muted mt-2">Meta semanal</p>
            </div>

            <div className="bg-white dark:bg-secondary-dark p-6 rounded-xl shadow-md border-t-4 border-green-500 transition-colors duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-text-muted text-sm font-medium">Horas Trabajadas</p>
                  <h3 className="text-3xl font-bold text-text-main mt-1">{formatHours(data.stats.workedHours)}</h3>
                </div>
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                  <CheckCircle size={24} />
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-3">
                <div 
                  className="bg-green-500 h-2.5 rounded-full" 
                  style={{ width: `${Math.min(100, (data.stats.workedHours / (data.stats.assignedHours || 1)) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white dark:bg-secondary-dark p-6 rounded-xl shadow-md border-t-4 border-yellow-500 transition-colors duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-text-muted text-sm font-medium">Pendientes</p>
                  <h3 className="text-3xl font-bold text-text-main mt-1">{formatHours(data.stats.pendingHours)}</h3>
                </div>
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-yellow-600 dark:text-yellow-400">
                  <Clock size={24} />
                </div>
              </div>
              <p className="text-xs text-text-muted mt-2">Restantes para cumplir meta</p>
            </div>

            <div className="bg-white dark:bg-secondary-dark p-6 rounded-xl shadow-md border-t-4 border-purple-500 transition-colors duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-text-muted text-sm font-medium">Horas Extras</p>
                  <h3 className="text-3xl font-bold text-text-main mt-1">{formatHours(data.stats.overtime)}</h3>
                </div>
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                  <AlertCircle size={24} />
                </div>
              </div>
              <p className="text-xs text-text-muted mt-2">Superando la meta</p>
            </div>

            <div className="bg-white dark:bg-secondary-dark p-6 rounded-xl shadow-md border-t-4 border-red-500 transition-colors duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-text-muted text-sm font-medium">Deuda Acumulada</p>
                  <h3 className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">{data.stats.debt}h</h3>
                </div>
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
                  <AlertCircle size={24} />
                </div>
              </div>
              <p className="text-xs text-text-muted mt-2">Total histórico</p>
            </div>
          </div>

          {/* Charts & History */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart */}
            <div className="bg-white dark:bg-secondary-dark p-6 rounded-xl shadow-md lg:col-span-2 transition-colors duration-300">
              <h3 className="text-lg font-bold text-text-main mb-4">Progreso Actual</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Asignadas', horas: data.stats.assignedHours },
                      { name: 'Trabajadas', horas: data.stats.workedHours },
                      { name: 'Pendientes', horas: data.stats.pendingHours },
                    ]}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis type="number" stroke="var(--text-muted)" />
                    <YAxis dataKey="name" type="category" width={100} stroke="var(--text-muted)" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                      itemStyle={{ color: 'var(--text-main)' }}
                    />
                    <Legend />
                    <Bar dataKey="horas" fill="#DB2777" radius={[0, 4, 4, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Shifts */}
            <div className="bg-white dark:bg-secondary-dark p-6 rounded-xl shadow-md transition-colors duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-text-main">Historial Reciente</h3>
                <History size={20} className="text-text-muted" />
              </div>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {data.shifts.length === 0 ? (
                    <p className="text-text-muted text-sm text-center py-4">No hay registros en este periodo.</p>
                ) : (
                    data.shifts.map((shift: any) => (
                    <div 
                      key={shift.id} 
                      onClick={() => setSelectedShift(shift)}
                      className="p-3 bg-background dark:bg-gray-800 rounded-lg border border-border-color hover:bg-secondary/10 transition-colors cursor-pointer"
                    >
                        <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-primary-dark dark:text-primary">
                            {new Date(shift.start_time).toLocaleDateString()}
                        </span>
                        <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
                            {formatDuration(shift.durationMs)}
                        </span>
                        </div>
                        <div className="text-sm text-text-main">
                        {new Date(shift.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                        {shift.end_time ? new Date(shift.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'En curso'}
                        </div>
                        {shift.observations && (
                            <p className="text-xs text-text-muted mt-1 italic truncate">"{shift.observations}"</p>
                        )}
                    </div>
                    ))
                )}
              </div>
            </div>
          </div>
          
          <ShiftDetailModal 
            shift={selectedShift} 
            onClose={() => setSelectedShift(null)} 
          />
        </>
      ) : null}
    </div>
  );
}
