import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

const Settings = () => {
  const { settings, setSettings } = useSettings();
  const [startTime, setStartTime] = useState(settings.startTime);
  const [endTime, setEndTime] = useState(settings.endTime);
  const [interval, setInterval] = useState(settings.interval);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setStartTime(settings.startTime);
    setEndTime(settings.endTime);
    setInterval(settings.interval);
  }, [settings]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSettings({ startTime, endTime, interval });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
        <SettingsIcon className="w-6 h-6" /> Configurações
      </h1>
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">Preferências do Sistema</h2>
        <p className="text-gray-600 mb-2">Aqui você poderá configurar opções do sistema, dados da empresa, horários, temas e muito mais.</p>
        <ul className="list-disc pl-6 text-gray-500">
          <li>Dados da empresa</li>
          <li>Horário de funcionamento</li>
          <li>Preferências de exibição</li>
          <li>Permissões e usuários</li>
          <li>Outras opções futuras...</li>
        </ul>
      </div>

      {/* Formulário de Horário de Funcionamento */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">Horário de Funcionamento da Agenda</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Início</label>
              <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="input" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fim</label>
              <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="input" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Intervalo (min)</label>
              <input type="number" min="5" step="5" value={interval} onChange={e => setInterval(Number(e.target.value))} className="input w-24" required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary mt-2">Salvar</button>
          {saved && <span className="ml-4 text-green-600">Configurações salvas!</span>}
        </form>
      </div>
    </div>
  );
};

export default Settings; 