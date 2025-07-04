import React, { useState, useEffect } from 'react';
import { 
  Users, 
  PawPrint, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Clock,
  MapPin,
  Loader2
} from 'lucide-react';
import { useClients } from '../hooks/useClients';

const Dashboard = () => {
  const { stats, loading, error } = useClients();
  const [todayAppointments, setTodayAppointments] = useState([]);

  useEffect(() => {
    // Simular agendamentos do dia (será implementado quando tivermos a API de agendamentos)
    setTodayAppointments([
      {
        id: 1,
        time: '09:00',
        petName: 'Rex',
        clientName: 'João Silva',
        service: 'Banho e Tosa',
        transport: true
      },
      {
        id: 2,
        time: '10:30',
        petName: 'Luna',
        clientName: 'Maria Santos',
        service: 'Consulta Veterinária',
        transport: false
      },
      {
        id: 3,
        time: '14:00',
        petName: 'Thor',
        clientName: 'Pedro Costa',
        service: 'Vacinação',
        transport: true
      }
    ]);
  }, []);

  const statCards = [
    {
      title: 'Total de Clientes',
      value: loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (stats?.total_clients || 0),
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Pets Cadastrados',
      value: loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (stats?.total_pets || 0),
      icon: PawPrint,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Agendamentos Hoje',
      value: loading ? <Loader2 className="w-6 h-6 animate-spin" /> : todayAppointments.length,
      icon: Calendar,
      color: 'bg-purple-500',
      change: '+2',
      changeType: 'positive'
    },
    {
      title: 'Receita Mensal',
      value: loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'R$ 0,00',
      icon: DollarSign,
      color: 'bg-orange-500',
      change: '+15%',
      changeType: 'positive'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Título da Página */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema de gerenciamento</p>
      </div>

      {/* Mensagem de Erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-5 h-5 bg-red-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">!</span>
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erro ao carregar dados</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="card animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <div className="text-2xl font-bold text-gray-900 mt-1">
                    {loading && typeof card.value === 'number' ? (
                      <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    ) : (
                      card.value
                    )}
                  </div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className={`w-4 h-4 mr-1 ${
                      card.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                    }`} />
                    <span className={`text-sm font-medium ${
                      card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {card.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">este mês</span>
                  </div>
                </div>
                <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Agenda do Dia */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agendamentos de Hoje */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Agenda de Hoje</h2>
            <span className="text-sm text-gray-500">
              {new Date().toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
          
          {todayAppointments.length > 0 ? (
            <div className="space-y-3">
              {todayAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg mr-3">
                    <Clock className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{appointment.time}</p>
                      {appointment.transport && (
                        <div className="flex items-center text-blue-600">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="text-xs font-medium">Transporte</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{appointment.petName} - {appointment.clientName}</p>
                    <p className="text-xs text-gray-500">{appointment.service}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Nenhum agendamento para hoje</p>
            </div>
          )}
        </div>

        {/* Atividades Recentes */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Atividades Recentes</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Novo cliente cadastrado</p>
                <p className="text-xs text-gray-500">Maria Santos - 2 minutos atrás</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Agendamento realizado</p>
                <p className="text-xs text-gray-500">Banho e Tosa - Rex - 15 minutos atrás</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Pagamento recebido</p>
                <p className="text-xs text-gray-500">R$ 120,00 - Consulta Veterinária - 1 hora atrás</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Novo pet cadastrado</p>
                <p className="text-xs text-gray-500">Luna - Cachorro - 2 horas atrás</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 