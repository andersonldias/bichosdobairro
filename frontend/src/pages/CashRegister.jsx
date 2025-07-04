import React from 'react';
import { DollarSign } from 'lucide-react';

const CashRegister = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Caixa</h1>
        <p className="text-gray-600">Controle financeiro e relatórios</p>
      </div>
      
      <div className="card">
        <div className="text-center py-12">
          <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Página em Desenvolvimento</h3>
          <p className="text-gray-500">
            Esta página será implementada com controle de caixa e relatórios financeiros.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CashRegister; 