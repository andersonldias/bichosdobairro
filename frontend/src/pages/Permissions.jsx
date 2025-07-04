import React from 'react';
import { Shield } from 'lucide-react';

const Permissions = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Permissões</h1>
        <p className="text-gray-600">Gerenciamento de usuários e permissões</p>
      </div>
      
      <div className="card">
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Página em Desenvolvimento</h3>
          <p className="text-gray-500">
            Esta página será implementada com controle de usuários e níveis de acesso.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Permissions; 