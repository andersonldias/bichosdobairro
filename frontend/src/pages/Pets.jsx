import React from 'react';
import { PawPrint } from 'lucide-react';

const Pets = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pets</h1>
        <p className="text-gray-600">Gerenciamento de pets cadastrados</p>
      </div>
      
      <div className="card">
        <div className="text-center py-12">
          <PawPrint className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Página em Desenvolvimento</h3>
          <p className="text-gray-500">
            Esta página será implementada com listagem e gerenciamento de pets.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pets; 