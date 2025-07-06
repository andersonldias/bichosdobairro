import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  User, 
  PawPrint,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  Filter,
  Search,
  Play,
  X
} from 'lucide-react';
import { useAppointments } from '../hooks/useAppointments';
import { useClients } from '../hooks/useClients';
import { usePets } from '../hooks/usePets';

const Agenda = () => {
  const { 
    appointments, 
    loading, 
    error, 
    stats,
    fetchAppointmentsByDate,
    updateAppointmentStatus,
    deleteAppointment,
    searchAppointments
  } = useAppointments();
  
  const { clients } = useClients();
  const { pets } = usePets();

  // Estados do calendário
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Memoizar a função de busca por data para evitar loops
  const fetchAppointmentsForMonth = useCallback(async () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    await fetchAppointmentsByDate(firstDay.toISOString().split('T')[0]);
  }, [currentDate, fetchAppointmentsByDate]);

  // Gerar calendário mensal
  const generateCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= lastDay || currentDate.getDay() !== 0) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  // Obter agendamentos para uma data específica
  const getAppointmentsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.appointment_date === dateStr);
  };

  // Obter agendamentos para o mês atual
  const getAppointmentsForMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return appointments.filter(apt => {
      const aptDate = new Date(apt.appointment_date);
      return aptDate.getFullYear() === year && aptDate.getMonth() === month;
    });
  };

  // Função para obter agendamentos do ano
  const getAppointmentsForYear = () => {
    const year = currentDate.getFullYear();
    return appointments.filter(apt => {
      const aptDate = new Date(apt.appointment_date);
      return aptDate.getFullYear() === year;
    });
  };

  // Função para agrupar por mês
  const getYearSummary = () => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: i,
      total: 0
    }));
    getAppointmentsForYear().forEach(apt => {
      const aptDate = new Date(apt.appointment_date);
      months[aptDate.getMonth()].total++;
    });
    return months;
  };

  // Filtrar agendamentos
  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = !searchQuery || 
      apt.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.pet_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.service_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Navegar no calendário
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // Selecionar data
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setViewMode('day'); // Mudar para visualização do dia
    const dateStr = date.toISOString().split('T')[0];
    fetchAppointmentsByDate(dateStr);
  };

  // Formatar data
  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  // Formatar hora
  const formatTime = (time) => {
    if (!time) return '';
    return time.substring(0, 5);
  };

  // Obter cor do status
  const getStatusColor = (status) => {
    switch (status) {
      case 'agendado': return 'bg-blue-100 text-blue-800';
      case 'em_andamento': return 'bg-yellow-100 text-yellow-800';
      case 'concluido': return 'bg-green-100 text-green-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Obter texto do status
  const getStatusText = (status) => {
    switch (status) {
      case 'agendado': return 'Agendado';
      case 'em_andamento': return 'Em Andamento';
      case 'concluido': return 'Concluído';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  // Função para gerar horários do dia
  const getDayHours = () => {
    const hours = [];
    for (let h = 8; h <= 18; h++) {
      hours.push(`${h.toString().padStart(2, '0')}:00`);
    }
    return hours;
  };

  // Carregar agendamentos do mês atual
  useEffect(() => {
    fetchAppointmentsForMonth();
  }, [fetchAppointmentsForMonth]);

  const calendarDays = generateCalendarDays(currentDate);
  const monthAppointments = getAppointmentsForMonth();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Agenda
          </h1>
          <p className="text-gray-600">
            {loading ? 'Carregando...' : `${appointments.length} agendamentos`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('day')}
            className={`px-3 py-1 rounded ${viewMode === 'day' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'}`}
          >
            Dia
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`px-3 py-1 rounded ${viewMode === 'month' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'}`}
          >
            Mês
          </button>
          <button
            onClick={() => setViewMode('year')}
            className={`px-3 py-1 rounded ${viewMode === 'year' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'}`}
          >
            Ano
          </button>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar agendamentos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="all">Todos os Status</option>
              <option value="agendado">Agendado</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="concluido">Concluído</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Visualização condicional */}
      {viewMode === 'month' && (
        <>
          {/* Calendário mensal */}
          <div className="card max-w-4xl mx-auto">
            {/* Navegação do calendário */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold">
                {currentDate.toLocaleDateString('pt-BR', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </h2>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Grid do calendário */}
            <div className="grid grid-cols-7 gap-1">
              {/* Cabeçalho dos dias da semana */}
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                <div key={day} className="p-2 text-center font-medium text-gray-600 text-sm">
                  {day}
                </div>
              ))}

              {/* Dias do calendário */}
              {calendarDays.map((day, index) => {
                const dayAppointments = getAppointmentsForDate(day);
                const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                const isToday = day.toDateString() === new Date().toDateString();
                const isSelected = day.toDateString() === selectedDate.toDateString();

                return (
                  <div
                    key={index}
                    onClick={() => handleDateSelect(day)}
                    className={`
                      min-h-[100px] p-2 border border-gray-200 cursor-pointer transition-colors
                      ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'}
                      ${isToday ? 'bg-blue-50 border-blue-300' : ''}
                      ${isSelected ? 'bg-blue-100 border-blue-400' : ''}
                      hover:bg-gray-50
                    `}
                  >
                    <div className="text-sm font-medium mb-1">
                      {day.getDate()}
                    </div>
                    
                    {/* Agendamentos do dia */}
                    <div className="space-y-1">
                      {dayAppointments.slice(0, 3).map((apt, aptIndex) => (
                        <div
                          key={apt.id}
                          className={`
                            text-xs p-1 rounded truncate cursor-pointer
                            ${getStatusColor(apt.status)}
                          `}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAppointment(apt);
                            setShowAppointmentModal(true);
                          }}
                        >
                          <div className="flex items-center gap-1">
                            <PawPrint className="w-3 h-3" />
                            <span className="truncate">{apt.pet_name}</span>
                          </div>
                          <div className="text-xs opacity-75 truncate">
                            {apt.service_name}
                          </div>
                        </div>
                      ))}
                      {dayAppointments.length > 3 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{dayAppointments.length - 3} mais
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
      {viewMode === 'day' && (
        <div className="card max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold mb-4">
            Agendamentos do dia {formatDate(selectedDate)}
          </h3>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
              <span className="ml-2 text-gray-600">Carregando agendamentos...</span>
            </div>
          ) : (
            <div className="space-y-2">
              {getDayHours().map(hour => {
                const agendamento = getAppointmentsForDate(selectedDate).find(apt => apt.appointment_time && apt.appointment_time.startsWith(hour));
                return (
                  <div key={hour} className="flex items-center gap-4 border-b py-2">
                    <span className="w-16 font-mono text-gray-700">{hour}</span>
                    {agendamento ? (
                      <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2">
                        <span className="font-medium text-blue-700">{agendamento.client_name} - {agendamento.pet_name}</span>
                        <span className="text-gray-500 text-sm">{agendamento.service_name}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agendamento.status)}`}>{getStatusText(agendamento.status)}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">Livre</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      {viewMode === 'year' && (
        <div className="card max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold mb-4">
            Resumo do ano de {currentDate.getFullYear()}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {getYearSummary().map((m, i) => (
              <div key={i} className="p-4 border rounded-lg text-center">
                <div className="text-lg font-bold text-blue-700">
                  {new Date(0, m.month).toLocaleString('pt-BR', { month: 'long' })}
                </div>
                <div className="text-2xl font-bold">{m.total}</div>
                <div className="text-gray-500 text-sm">agendamentos</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lista de Agendamentos */}
      {viewMode === 'month' && (
        <div className="card max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold mb-4">
            Agendamentos - {formatDate(selectedDate)}
          </h3>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
              <span className="ml-2 text-gray-600">Carregando agendamentos...</span>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum agendamento encontrado
              </h3>
              <p className="text-gray-500">
                {searchQuery || filterStatus !== 'all' 
                  ? 'Tente ajustar os filtros de busca'
                  : 'Não há agendamentos para esta data'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <PawPrint className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{apt.client_name}</span>
                        <span className="text-gray-500">•</span>
                        <PawPrint className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{apt.pet_name}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {formatDate(new Date(apt.appointment_date))} às {formatTime(apt.appointment_time)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{apt.service_name}</span>
                        <span className="text-sm font-medium text-gray-900">
                          R$ {parseFloat(apt.total_price || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                        {getStatusText(apt.status)}
                      </span>
                      <div className="flex gap-1">
                        {apt.status === 'agendado' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'em_andamento')}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="Iniciar"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        )}
                        {apt.status === 'em_andamento' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'concluido')}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="Concluir"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedAppointment(apt);
                            setShowAppointmentModal(true);
                          }}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteAppointment(apt.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Estatísticas no final */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8">
          <div className="card">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_appointments || 0}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending || 0}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Concluídos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed || 0}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Hoje</p>
                <p className="text-2xl font-bold text-gray-900">{stats.today || 0}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes do Agendamento */}
      {showAppointmentModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Detalhes do Agendamento</h3>
              <button
                onClick={() => setShowAppointmentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Cliente</label>
                <p className="text-gray-900">{selectedAppointment.client_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Pet</label>
                <p className="text-gray-900">{selectedAppointment.pet_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Serviço</label>
                <p className="text-gray-900">{selectedAppointment.service_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Data</label>
                <p className="text-gray-900">
                  {formatDate(new Date(selectedAppointment.appointment_date))} às {formatTime(selectedAppointment.appointment_time)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedAppointment.status)}`}>
                  {getStatusText(selectedAppointment.status)}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Valor</label>
                <p className="text-gray-900">R$ {parseFloat(selectedAppointment.total_price || 0).toFixed(2)}</p>
              </div>
              {selectedAppointment.observations && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Observações</label>
                  <p className="text-gray-900">{selectedAppointment.observations}</p>
                </div>
              )}
            </div>
            
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowAppointmentModal(false)}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  // Implementar edição
                  setShowAppointmentModal(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Editar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agenda; 