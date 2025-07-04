import React from 'react';
import { Calendar } from 'lucide-react';

const Agenda = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Agenda</h1>
        <p className="text-gray-600">Visualização e gerenciamento da agenda</p>
      </div>
      
      <div className="card">
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Página em Desenvolvimento</h3>
          <p className="text-gray-500">
            Esta página será implementada com calendário e visualização de agendamentos.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Agenda; 