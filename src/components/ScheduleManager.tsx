import React, { useState, useEffect } from 'react';
import { Save, Clock, Calendar, CheckCircle } from 'lucide-react';

interface ScheduleDay {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_rest_day: boolean;
}

interface ScheduleManagerProps {
  serverId: string;
  userId: string;
  onSave?: () => void;
}

const DAYS = [
  { id: 1, name: 'Lunes' },
  { id: 2, name: 'Martes' },
  { id: 3, name: 'Miércoles' },
  { id: 4, name: 'Jueves' },
  { id: 5, name: 'Viernes' },
  { id: 6, name: 'Sábado' },
  { id: 7, name: 'Domingo' },
];

export default function ScheduleManager({ serverId, userId, onSave }: ScheduleManagerProps) {
  const [globalStart, setGlobalStart] = useState('09:00');
  const [globalEnd, setGlobalEnd] = useState('17:00');
  const [restDays, setRestDays] = useState<number[]>([]);
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
        // Find first working day to set global times
        const workingDay = data.find((d: any) => !d.is_rest_day);
        if (workingDay) {
          setGlobalStart(workingDay.start_time ? workingDay.start_time.slice(0, 5) : '09:00');
          setGlobalEnd(workingDay.end_time ? workingDay.end_time.slice(0, 5) : '17:00');
        }

        // Set rest days
        const rDays = data.filter((d: any) => d.is_rest_day).map((d: any) => d.day_of_week);
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

    const start = new Date(`1970-01-01T${globalStart}`);
    const end = new Date(`1970-01-01T${globalEnd}`);
    let diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    if (diff < 0) diff = 0;

    const workingDaysCount = 7 - restDays.length;
    setTotalHours(diff * workingDaysCount);
  };

  const toggleRestDay = (dayId: number) => {
    if (restDays.includes(dayId)) {
      setRestDays(restDays.filter(id => id !== dayId));
    } else {
      setRestDays([...restDays, dayId]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Construct schedule array
      const schedule = DAYS.map(day => ({
        day_of_week: day.id,
        start_time: globalStart,
        end_time: globalEnd,
        is_rest_day: restDays.includes(day.id)
      }));

      const res = await fetch('/api/admin/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        alert('Horario guardado correctamente');
      } else {
        alert('Error al guardar horario');
      }
    } catch (e) {
      console.error(e);
      alert('Error de conexión');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4 text-center text-text-main">Cargando horario...</div>;

  return (
    <div className="bg-white dark:bg-secondary-dark p-6 rounded-xl shadow-lg font-roboto border border-border">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-lilita text-secondary-dark dark:text-white flex items-center gap-2">
          <Calendar className="text-primary" /> Configuración de Horario
        </h3>
        <div className="bg-primary/10 px-4 py-2 rounded-lg border border-primary/20">
          <span className="text-sm text-primary font-bold uppercase">Total Semanal</span>
          <p className="text-2xl font-bold text-primary-dark dark:text-primary">{totalHours.toFixed(1)}h</p>
        </div>
      </div>

      {/* Global Time Settings */}
      <div className="bg-background p-4 rounded-lg border border-border mb-6 flex flex-col md:flex-row gap-6 items-center">
        <div className="flex items-center gap-2">
            <Clock className="text-primary" />
            <span className="font-bold text-text-main">Horario General:</span>
        </div>
        <div className="flex items-center gap-4">
            <div>
                <label className="block text-xs text-text-muted mb-1">Entrada</label>
                <input 
                    type="time" 
                    value={globalStart}
                    onChange={(e) => setGlobalStart(e.target.value)}
                    className="border border-border bg-white dark:bg-secondary-dark text-text-main rounded-lg p-2 font-mono focus:ring-primary focus:border-primary"
                />
            </div>
            <span className="text-text-muted mt-4">-</span>
            <div>
                <label className="block text-xs text-text-muted mb-1">Salida</label>
                <input 
                    type="time" 
                    value={globalEnd}
                    onChange={(e) => setGlobalEnd(e.target.value)}
                    className="border border-border bg-white dark:bg-secondary-dark text-text-main rounded-lg p-2 font-mono focus:ring-primary focus:border-primary"
                />
            </div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-bold text-text-main mb-3">Selecciona los días de descanso:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {DAYS.map(day => {
                const isRest = restDays.includes(day.id);
                return (
                    <div 
                        key={day.id}
                        onClick={() => toggleRestDay(day.id)}
                        className={`
                            cursor-pointer p-3 rounded-lg border transition-all flex items-center justify-between
                            ${isRest 
                                ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-800 dark:text-green-300 shadow-sm' 
                                : 'bg-white dark:bg-secondary-dark border-border text-text-muted hover:bg-background'
                            }
                        `}
                    >
                        <span className="font-bold">{day.name}</span>
                        {isRest && <CheckCircle size={16} />}
                    </div>
                );
            })}
        </div>
      </div>

      <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
          <div className="flex items-center gap-3">
              <input 
                  type="checkbox" 
                  id="proRating"
                  checked={applyProRating}
                  onChange={(e) => setApplyProRating(e.target.checked)}
                  className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
              />
              <label htmlFor="proRating" className="text-sm text-text-main font-medium cursor-pointer select-none">
                  Aplicar prorrateo (inicio a mitad de semana)
                  <p className="text-xs text-text-muted font-normal mt-1">
                      Si se marca, se restarán de la deuda las horas correspondientes a los días de esta semana que ya han pasado.
                  </p>
              </label>
          </div>
      </div>

      <div className="mt-8 flex justify-end border-t border-border pt-4">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors font-bold disabled:opacity-50 shadow-lg"
        >
          <Save size={20} />
          {saving ? 'Guardando...' : 'Guardar Configuración'}
        </button>
      </div>
    </div>
  );
}
