import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  PawPrint, 
  Scissors, 
  Calendar, 
  DollarSign, 
  BarChart3, 
  Shield,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/clients', icon: Users, label: 'Clientes' },
    { path: '/pets', icon: PawPrint, label: 'Pets' },
    { path: '/services', icon: Scissors, label: 'Serviços' },
    { path: '/agenda', icon: Calendar, label: 'Agenda' },
    { path: '/cash-register', icon: DollarSign, label: 'Caixa' },
    { path: '/statistics', icon: BarChart3, label: 'Estatísticas' },
    { path: '/permissions', icon: Shield, label: 'Permissões' },
  ];

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header do Sidebar */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <PawPrint className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">PetShop</h1>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Menu de Navegação */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  sidebar-item ${isActive ? 'active' : ''}
                `}
                onClick={() => setIsOpen(false)}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer do Sidebar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p>© 2024 PetShop</p>
            <p className="text-xs mt-1">Sistema de Gerenciamento</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 