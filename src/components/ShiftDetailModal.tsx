import React from 'react';
import { X, Clock, Calendar, AlignLeft, Coffee } from 'lucide-react';

interface Break {
  break_start: string;
  break_end?: string;
  reason?: string;
}

interface Shift {
  id: number | string;
  nickname?: string;
  username?: string;
  start_time: string;
  end_time?: string;
  durationMs?: number;
  breakMs?: number;
  observations?: string;
  breaks?: Break[];
}

interface ShiftDetailModalProps {
  shift: Shift | null;
  onClose: () => void;
}

export default function ShiftDetailModal({ shift, onClose }: ShiftDetailModalProps) {
  if (!shift) return null;

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('es-ES', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  };

  const formatDuration = (ms: number) => {
    if (!ms) return '00:00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 font-roboto">
      <div className="bg-white dark:bg-secondary-dark rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in transition-colors duration-300">
        
        {/* Header */}
        <div className="bg-secondary-dark text-white p-6 flex justify-between items-start sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-lilita">Detalle del Turno</h2>
            {shift.nickname && (
              <p className="text-gray-300 text-sm mt-1">
                Usuario: <span className="font-bold text-white">{shift.nickname}</span> (@{shift.username})
              </p>
            )}
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Times Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-background dark:bg-gray-800 p-4 rounded-lg border border-border-color">
              <div className="flex items-center gap-2 text-primary-dark dark:text-primary mb-2">
                <Calendar size={20} />
                <h3 className="font-bold">Inicio</h3>
              </div>
              <p className="text-text-main font-mono">{formatDateTime(shift.start_time)}</p>
            </div>

            <div className="bg-background dark:bg-gray-800 p-4 rounded-lg border border-border-color">
              <div className="flex items-center gap-2 text-primary-dark dark:text-primary mb-2">
                <Clock size={20} />
                <h3 className="font-bold">Fin</h3>
              </div>
              <p className="text-text-main font-mono">
                {shift.end_time ? formatDateTime(shift.end_time) : <span className="text-green-600 dark:text-green-400 font-bold">En Curso</span>}
              </p>
            </div>

            <div className="bg-background dark:bg-gray-800 p-4 rounded-lg border border-border-color">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-2">
                <Clock size={20} />
                <h3 className="font-bold">Tiempo Trabajado</h3>
              </div>
              <p className="text-text-main font-mono font-bold text-lg">
                {formatDuration(shift.durationMs || 0)}
              </p>
            </div>

            <div className="bg-background dark:bg-gray-800 p-4 rounded-lg border border-border-color">
              <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 mb-2">
                <Coffee size={20} />
                <h3 className="font-bold">Tiempo en Break</h3>
              </div>
              <p className="text-text-main font-mono font-bold text-lg">
                {formatDuration(shift.breakMs || 0)}
              </p>
            </div>
          </div>

          {/* Observations */}
          <div className="border-t border-border-color pt-4">
            <div className="flex items-center gap-2 text-text-main mb-3">
              <AlignLeft size={20} />
              <h3 className="font-bold text-lg">Observaciones</h3>
            </div>
            <div className="bg-background dark:bg-gray-800 p-4 rounded-lg border border-border-color min-h-[80px]">
              {shift.observations ? (
                <p className="text-text-main whitespace-pre-wrap">{shift.observations}</p>
              ) : (
                <p className="text-text-muted italic">Sin observaciones registradas.</p>
              )}
            </div>
          </div>

          {/* Breaks List */}
          <div className="border-t border-border-color pt-4">
            <div className="flex items-center gap-2 text-text-main mb-3">
              <Coffee size={20} />
              <h3 className="font-bold text-lg">Historial de Breaks</h3>
            </div>
            
            {!shift.breaks || shift.breaks.length === 0 ? (
               <p className="text-text-muted italic">No se registraron breaks en este turno.</p>
            ) : (
              <div className="space-y-3">
                {shift.breaks.map((b, index) => {
                   const start = new Date(b.break_start).getTime();
                   const end = b.break_end ? new Date(b.break_end).getTime() : Date.now();
                   const duration = end - start;
                   
                   return (
                    <div key={index} className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-yellow-800 dark:text-yellow-300 text-sm">Break #{index + 1}</span>
                        <span className="bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 text-xs px-2 py-1 rounded-full font-mono">
                          {formatDuration(duration)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-text-muted mb-2">
                        <div>
                          <span className="font-semibold">Inicio:</span> {new Date(b.break_start).toLocaleTimeString()}
                        </div>
                        <div>
                          <span className="font-semibold">Fin:</span> {b.break_end ? new Date(b.break_end).toLocaleTimeString() : 'En curso'}
                        </div>
                      </div>
                      {b.reason && (
                        <div className="text-sm text-text-main bg-white dark:bg-gray-800 p-2 rounded border border-yellow-100 dark:border-yellow-800">
                          <span className="font-semibold text-yellow-700 dark:text-yellow-400">Razón:</span> {b.reason}
                        </div>
                      )}
                    </div>
                   );
                })}
              </div>
            )}
          </div>

        </div>
        
        <div className="p-6 border-t border-border-color bg-background dark:bg-gray-800 rounded-b-xl flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-secondary-dark text-white rounded-lg hover:bg-gray-800 transition-colors font-bold"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
