import React from 'react';
import { Users, PawPrint, Calendar, DollarSign, Loader2 } from 'lucide-react';
import { useClients } from '../hooks/useClients';

const Dashboard = () => {
  const { stats, loading, error } = useClients();

  const statCards = [
    {
      title: 'Total de Clientes',
      value: loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (stats?.total_clients || 0),
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Pets Cadastrados',
      value: loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (stats?.total_pets || 0),
      icon: PawPrint,
      color: 'bg-green-500'
    },
    {
      title: 'Agendamentos Hoje',
      value: 0,
      icon: Calendar,
      color: 'bg-purple-500'
    },
    {
      title: 'Receita Mensal',
      value: 'R$ 0,00',
      icon: DollarSign,
      color: 'bg-orange-500'
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
                    {card.value}
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
      <div className="card mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Agenda de Hoje</h2>
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Nenhum agendamento para hoje</p>
        </div>
      </div>

      {/* Atividades Recentes */}
      <div className="card mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Atividades Recentes</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhuma atividade recente</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 