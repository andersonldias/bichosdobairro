import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Pets from './pages/Pets';
import Services from './pages/Services';
import Agenda from './pages/Agenda';
import CashRegister from './pages/CashRegister';
import Statistics from './pages/Statistics';
import Permissions from './pages/Permissions';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/pets" element={<Pets />} />
            <Route path="/services" element={<Services />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/cash-register" element={<CashRegister />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/permissions" element={<Permissions />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App; 