import React, { useState, useEffect } from 'react';
import { Calendar, X, DollarSign, AlertCircle } from 'lucide-react';
import ScheduleManager from './ScheduleManager';

interface Server {
  id: number | string;
  name: string;
}

interface User {
  id: string;
  username: string;
  nickname: string;
  weekly_hours: number;
  accumulated_debt: number;
}

export default function AdminHoursManager({ adminServers }: { adminServers: Server[] }) {
  const [selectedServer, setSelectedServer] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [scheduleModalUser, setScheduleModalUser] = useState<User | null>(null);
  const [debtModalUser, setDebtModalUser] = useState<User | null>(null);
  const [debtAmount, setDebtAmount] = useState<string>("");
  const [debtType, setDebtType] = useState<'partial' | 'total'>('partial');

  const fetchUsers = () => {
    if (!selectedServer) {
        setUsers([]);
        return;
    }
    setLoading(true);
    fetch(`/api/server-users?serverId=${selectedServer}`)
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
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
        const res = await fetch('/api/admin/reduce-debt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                serverId: selectedServer,
                targetUserId: debtModalUser.id,
                amount: debtType === 'partial' ? parseFloat(debtAmount) : 0,
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

  return (
    <div className="bg-white dark:bg-secondary-dark p-6 rounded-lg shadow-md mt-6 font-roboto border border-border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-lilita text-secondary-dark dark:text-white">Gestión de Usuarios</h2>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-text-main mb-2">Seleccionar Servidor</label>
        <select
          className="block w-full md:w-1/3 pl-3 pr-10 py-2 text-base bg-background text-text-main border-border focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md border"
          value={selectedServer}
          onChange={(e) => setSelectedServer(e.target.value)}
        >
          <option value="">Seleccione un servidor...</option>
          {adminServers.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {loading && (
          <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
      )}

      {!loading && users.length > 0 && (
        <div className="overflow-x-auto bg-background rounded-lg border border-border">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-secondary-dark text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Horas Semanales</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Deuda</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-secondary-dark divide-y divide-border">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-background transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="ml-4">
                            <div className="text-sm font-medium text-text-main">{user.nickname || user.username}</div>
                            <div className="text-sm text-text-muted">@{user.username}</div>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center bg-background rounded-lg p-2 w-24 border border-border">
                        <span className="font-bold text-text-main text-lg">{user.weekly_hours || 0}</span>
                        <span className="ml-1 text-text-muted text-xs">hrs</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center justify-center rounded-lg p-2 w-24 border border-border ${Number(user.accumulated_debt) > 0 ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-background text-text-main'}`}>
                        <span className="font-bold text-lg">{Number(user.accumulated_debt || 0).toFixed(1)}</span>
                        <span className="ml-1 text-xs">hrs</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setScheduleModalUser(user)}
                            className="flex items-center gap-1 text-primary hover:text-primary-dark font-bold text-sm bg-primary/10 px-3 py-1 rounded-lg transition-colors"
                        >
                            <Calendar size={16} />
                            Gestionar Horario
                        </button>
                        {Number(user.accumulated_debt) > 0 && (
                            <button 
                                onClick={() => {
                                    setDebtModalUser(user);
                                    setDebtType('partial');
                                    setDebtAmount("");
                                }}
                                className="flex items-center gap-1 text-red-600 hover:text-red-700 font-bold text-sm bg-red-100 px-3 py-1 rounded-lg transition-colors"
                            >
                                <DollarSign size={16} />
                                Reducir Deuda
                            </button>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {!loading && selectedServer && users.length === 0 && (
          <p className="text-center text-text-muted py-10">No se encontraron usuarios en este servidor.</p>
      )}

      {/* Schedule Modal */}
      {scheduleModalUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-secondary-dark rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative border border-border">
                <button 
                    onClick={() => setScheduleModalUser(null)}
                    className="absolute top-4 right-4 text-text-muted hover:text-text-main transition-colors"
                >
                    <X size={24} />
                </button>
                <div className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-text-main">
                        Horario de {scheduleModalUser.nickname}
                    </h3>
                    <ScheduleManager 
                        serverId={selectedServer} 
                        userId={scheduleModalUser.id} 
                        onSave={() => {
                            fetchUsers(); // Refresh to get updated hours
                            // Don't close modal automatically, let user see confirmation or close manually
                        }}
                    />
                </div>
            </div>
        </div>
      )}

      {/* Debt Reduction Modal */}
      {debtModalUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-secondary-dark rounded-xl shadow-2xl max-w-md w-full relative border border-border p-6">
                <button 
                    onClick={() => setDebtModalUser(null)}
                    className="absolute top-4 right-4 text-text-muted hover:text-text-main transition-colors"
                >
                    <X size={24} />
                </button>
                
                <h3 className="text-xl font-bold mb-4 text-text-main flex items-center gap-2">
                    <DollarSign className="text-red-500" />
                    Reducir Deuda
                </h3>
                
                <p className="text-text-muted mb-4">
                    Usuario: <span className="font-bold text-text-main">{debtModalUser.nickname}</span><br/>
                    Deuda Actual: <span className="font-bold text-red-500">{debtModalUser.accumulated_debt} hrs</span>
                </p>

                <div className="space-y-4">
                    <div className="flex gap-4">
                        <button
                            onClick={() => setDebtType('partial')}
                            className={`flex-1 py-2 rounded-lg border ${debtType === 'partial' ? 'bg-primary text-white border-primary' : 'bg-background text-text-main border-border'}`}
                        >
                            Parcial
                        </button>
                        <button
                            onClick={() => setDebtType('total')}
                            className={`flex-1 py-2 rounded-lg border ${debtType === 'total' ? 'bg-primary text-white border-primary' : 'bg-background text-text-main border-border'}`}
                        >
                            Total
                        </button>
                    </div>

                    {debtType === 'partial' && (
                        <div>
                            <label className="block text-sm font-medium text-text-main mb-1">Cantidad a reducir (horas)</label>
                            <input 
                                type="number" 
                                value={debtAmount}
                                onChange={(e) => setDebtAmount(e.target.value)}
                                className="w-full p-2 bg-background border border-border rounded-lg text-text-main focus:ring-primary focus:border-primary"
                                placeholder="Ej: 5"
                                min="0"
                                max={debtModalUser.accumulated_debt}
                            />
                        </div>
                    )}

                    {debtType === 'total' && (
                        <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg flex items-start gap-2 text-yellow-700 dark:text-yellow-400 text-sm">
                            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                            <p>Se eliminará toda la deuda acumulada de este usuario.</p>
                        </div>
                    )}

                    <div className="flex justify-end gap-2 mt-6">
                        <button 
                            onClick={() => setDebtModalUser(null)}
                            className="px-4 py-2 text-text-muted hover:text-text-main transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={handleReduceDebt}
                            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors font-bold"
                            disabled={debtType === 'partial' && (!debtAmount || parseFloat(debtAmount) <= 0)}
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
