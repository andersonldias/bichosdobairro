import React, { useState } from 'react';
import { Scissors, Calendar, Plus, Check, X, Loader2, AlertCircle } from 'lucide-react';
import { useClients } from '../hooks/useClients';
import { usePets } from '../hooks/usePets';
import { useServiceTypes } from '../hooks/useServiceTypes';
import { useAppointments } from '../hooks/useAppointments';

const tiposServicosPadrao = [
  'Banho',
  'Tosa',
  'Consulta',
  'Vacina',
  'Outro'
];

const Services = () => {
  const { clients } = useClients();
  const { pets } = usePets();
  const { serviceTypes, loading: serviceTypesLoading } = useServiceTypes();
  const { 
    appointments, 
    loading: appointmentsLoading, 
    error: appointmentsError,
    createAppointment,
    fetchAppointmentsByDate,
    updateAppointmentStatus,
    deleteAppointment
  } = useAppointments();

  // Abas
  const [aba, setAba] = useState('cadastro');

  // Formulário
  const [clienteInput, setClienteInput] = useState('');
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [showClienteSugestoes, setShowClienteSugestoes] = useState(false);
  const [clienteSugestaoIndex, setClienteSugestaoIndex] = useState(-1);

  const [petInput, setPetInput] = useState('');
  const [petSelecionado, setPetSelecionado] = useState(null);
  const [showPetSugestoes, setShowPetSugestoes] = useState(false);
  const [petSugestaoIndex, setPetSugestaoIndex] = useState(-1);

  const [tipoServicoInput, setTipoServicoInput] = useState('');
  const [showTipoSugestoes, setShowTipoSugestoes] = useState(false);
  const [tipoSugestaoIndex, setTipoSugestaoIndex] = useState(-1);

  const [valor, setValor] = useState('');
  const [dataAgendamento, setDataAgendamento] = useState('');
  const [transporte, setTransporte] = useState('Não');
  const [valorTransporte, setValorTransporte] = useState('');

  // Sugestões filtradas
  const clientesFiltrados = clients.filter(c => c.name.toLowerCase().includes(clienteInput.toLowerCase()));
  const petsFiltrados = pets.filter(p =>
    (!clienteSelecionado || p.client_id === clienteSelecionado.id) &&
    p.name.toLowerCase().includes(petInput.toLowerCase())
  );
  const tiposFiltrados = serviceTypes.filter(t => t.name.toLowerCase().includes(tipoServicoInput.toLowerCase()));

  // Handlers de teclado para sugestões
  function handleClienteKeyDown(e) {
    if (!showClienteSugestoes || clientesFiltrados.length === 0) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setClienteSugestaoIndex(prev => prev < clientesFiltrados.length - 1 ? prev + 1 : 0);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setClienteSugestaoIndex(prev => prev > 0 ? prev - 1 : clientesFiltrados.length - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (clienteSugestaoIndex >= 0) {
          const c = clientesFiltrados[clienteSugestaoIndex];
          setClienteSelecionado(c);
          setClienteInput(c.name);
          setShowClienteSugestoes(false);
          setClienteSugestaoIndex(-1);
        }
        break;
      case 'Escape':
        setShowClienteSugestoes(false);
        setClienteSugestaoIndex(-1);
        break;
    }
  }
  function handlePetKeyDown(e) {
    if (!showPetSugestoes || petsFiltrados.length === 0) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setPetSugestaoIndex(prev => prev < petsFiltrados.length - 1 ? prev + 1 : 0);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setPetSugestaoIndex(prev => prev > 0 ? prev - 1 : petsFiltrados.length - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (petSugestaoIndex >= 0) {
          const p = petsFiltrados[petSugestaoIndex];
          setPetSelecionado(p);
          setPetInput(p.name);
          setShowPetSugestoes(false);
          setPetSugestaoIndex(-1);
        }
        break;
      case 'Escape':
        setShowPetSugestoes(false);
        setPetSugestaoIndex(-1);
        break;
    }
  }
  function handleTipoKeyDown(e) {
    if (!showTipoSugestoes || tiposFiltrados.length === 0) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setTipoSugestaoIndex(prev => prev < tiposFiltrados.length - 1 ? prev + 1 : 0);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setTipoSugestaoIndex(prev => prev > 0 ? prev - 1 : tiposFiltrados.length - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (tipoSugestaoIndex >= 0) {
          const t = tiposFiltrados[tipoSugestaoIndex];
          setTipoServicoInput(t);
          setShowTipoSugestoes(false);
          setTipoSugestaoIndex(-1);
        }
        break;
      case 'Escape':
        setShowTipoSugestoes(false);
        setTipoSugestaoIndex(-1);
        break;
    }
  }

  async function handleAdicionarServico(e) {
    e.preventDefault();
    if (!clienteSelecionado || !petSelecionado || !tipoServicoInput || !valor || !dataAgendamento) return;
    
    try {
      // Encontrar o tipo de serviço selecionado
      const serviceType = serviceTypes.find(st => st.name === tipoServicoInput);
      
      await createAppointment({
        client_id: clienteSelecionado.id,
        pet_id: petSelecionado.id,
        service_type_id: serviceType?.id || null,
        service_name: tipoServicoInput,
        price: parseFloat(valor),
        appointment_date: dataAgendamento,
        transport_required: transporte === 'Sim',
        transport_price: transporte === 'Sim' ? parseFloat(valorTransporte) : 0.00
      });
      
      // Limpar campos do pet e serviço
      setPetSelecionado(null);
      setPetInput('');
      setTipoServicoInput('');
      setValor('');
      setDataAgendamento('');
      setTransporte('Não');
      setValorTransporte('');
      
      // Atualizar lista de agendamentos
      fetchAppointmentsByDate(dataAgendamento);
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      alert('Erro ao criar agendamento. Tente novamente.');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Scissors /> Serviços</h1>
        <div className="flex gap-2 mt-4">
          <button className={`btn-primary ${aba === 'cadastro' ? 'bg-blue-700' : ''}`} onClick={() => setAba('cadastro')}>Cadastro de Serviços</button>
          <button className={`btn-secondary ${aba === 'visualizar' ? 'bg-blue-100' : ''}`} onClick={() => setAba('visualizar')}>Visualizar Agendamentos</button>
        </div>
      </div>

      {aba === 'cadastro' && (
        <form className="card space-y-4 max-w-xl mx-auto" onSubmit={handleAdicionarServico}>
          {/* Cliente */}
          <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
            Cliente
          </label>
            <input
              type="text"
              placeholder="Selecione o cliente..."
              value={clienteInput}
              onChange={e => {
                setClienteInput(e.target.value);
                setShowClienteSugestoes(true);
                setClienteSugestaoIndex(-1);
                setClienteSelecionado(null);
              }}
              onKeyDown={handleClienteKeyDown}
              onFocus={() => setShowClienteSugestoes(true)}
              onBlur={() => setTimeout(() => setShowClienteSugestoes(false), 150)}
              className="input-field"
              autoComplete="off"
            />
            {showClienteSugestoes && clientesFiltrados.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {clientesFiltrados.map((c, idx) => (
                  <div
                    key={c.id}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${idx === clienteSugestaoIndex ? 'bg-blue-100 text-blue-900' : ''}`}
                    onClick={() => {
                      setClienteSelecionado(c);
                      setClienteInput(c.name);
                      setShowClienteSugestoes(false);
                      setClienteSugestaoIndex(-1);
                    }}
                  >
                    {c.name}
                    {idx === clienteSugestaoIndex && <span className="ml-2 text-blue-600">← Selecionado</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pet */}
          <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
            Pet
          </label>
            <input
              type="text"
              placeholder="Selecione o pet..."
              value={petInput}
              onChange={e => {
                setPetInput(e.target.value);
                setShowPetSugestoes(true);
                setPetSugestaoIndex(-1);
                setPetSelecionado(null);
              }}
              onKeyDown={handlePetKeyDown}
              onFocus={() => setShowPetSugestoes(true)}
              onBlur={() => setTimeout(() => setShowPetSugestoes(false), 150)}
              className="input-field"
              autoComplete="off"
              disabled={!clienteSelecionado}
            />
            {showPetSugestoes && petsFiltrados.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {petsFiltrados.map((p, idx) => (
                  <div
                    key={p.id}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${idx === petSugestaoIndex ? 'bg-blue-100 text-blue-900' : ''}`}
                    onClick={() => {
                      setPetSelecionado(p);
                      setPetInput(p.name);
                      setShowPetSugestoes(false);
                      setPetSugestaoIndex(-1);
                    }}
                  >
                    {p.name}
                    {idx === petSugestaoIndex && <span className="ml-2 text-blue-600">← Selecionado</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tipo de serviço */}
          <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Serviço
          </label>
            <input
              type="text"
              placeholder="Tipo de serviço..."
              value={tipoServicoInput}
              onChange={e => {
                setTipoServicoInput(e.target.value);
                setShowTipoSugestoes(true);
                setTipoSugestaoIndex(-1);
              }}
              onKeyDown={handleTipoKeyDown}
              onFocus={() => setShowTipoSugestoes(true)}
              onBlur={() => setTimeout(() => setShowTipoSugestoes(false), 150)}
              className="input-field"
              autoComplete="off"
            />
            {showTipoSugestoes && tiposFiltrados.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {tiposFiltrados.map((t, idx) => (
                  <div
                    key={t}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${idx === tipoSugestaoIndex ? 'bg-blue-100 text-blue-900' : ''}`}
                    onClick={() => {
                      setTipoServicoInput(t);
                      setShowTipoSugestoes(false);
                      setTipoSugestaoIndex(-1);
                    }}
                  >
                    {t}
                    {idx === tipoSugestaoIndex && <span className="ml-2 text-blue-600">← Selecionado</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Valor do serviço */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valor do Serviço (R$)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="input-field"
              value={valor}
              onChange={e => setValor(e.target.value)}
              placeholder="Digite o valor do serviço"
              required
            />
          </div>

          {/* Data do agendamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data do Agendamento</label>
            <input
              type="date"
              className="input-field"
              value={dataAgendamento}
              onChange={e => setDataAgendamento(e.target.value)}
              required
            />
          </div>

          {/* Transporte */}
          <div className="flex items-center gap-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Transporte?</label>
            <select
              className="input-field w-32"
              value={transporte}
              onChange={e => setTransporte(e.target.value)}
            >
              <option value="Não">Não</option>
              <option value="Sim">Sim</option>
            </select>
            {transporte === 'Sim' && (
              <input
                type="number"
                min="0"
                step="0.01"
                className="input-field w-40"
                value={valorTransporte}
                onChange={e => setValorTransporte(e.target.value)}
                placeholder="Valor do transporte (R$)"
                required
              />
            )}
          </div>

          <button type="submit" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Adicionar Serviço
          </button>
        </form>
      )}

      {aba === 'visualizar' && (
        <div className="card max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Calendar /> Agendamentos</h2>
          
          {appointmentsError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                <span className="text-red-800">{appointmentsError}</span>
              </div>
            </div>
          )}
          
          {appointmentsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
              <span className="ml-2 text-gray-600">Carregando agendamentos...</span>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center text-gray-500 py-8">Nenhum agendamento cadastrado.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 px-3 text-left">Animal</th>
                  <th className="py-2 px-3 text-left">Cliente</th>
                  <th className="py-2 px-3 text-left">Tipo de Serviço</th>
                  <th className="py-2 px-3 text-left">Valor</th>
                  <th className="py-2 px-3 text-left">Data</th>
                  <th className="py-2 px-3 text-left">Status</th>
                  <th className="py-2 px-3 text-left">Transporte</th>
                  <th className="py-2 px-3 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-3">{a.pet_name}</td>
                    <td className="py-2 px-3">{a.client_name}</td>
                    <td className="py-2 px-3">{a.service_name}</td>
                    <td className="py-2 px-3">R$ {parseFloat(a.price).toFixed(2)}</td>
                    <td className="py-2 px-3">{a.appointment_date}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        a.status === 'agendado' ? 'bg-blue-100 text-blue-800' :
                        a.status === 'em_andamento' ? 'bg-yellow-100 text-yellow-800' :
                        a.status === 'concluido' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {a.status === 'agendado' ? 'Agendado' :
                         a.status === 'em_andamento' ? 'Em Andamento' :
                         a.status === 'concluido' ? 'Concluído' : 'Cancelado'}
                      </span>
                    </td>
                    <td className="py-2 px-3 flex items-center gap-1">
                      {a.transport_required ? <Check className="text-green-600 w-4 h-4" /> : <X className="text-gray-400 w-4 h-4" />}
                      {a.transport_required && a.transport_price > 0 && (
                        <span className="text-xs text-gray-500 ml-1">+R$ {parseFloat(a.transport_price).toFixed(2)}</span>
                      )}
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex space-x-2">
                        {a.status === 'agendado' && (
                          <button
                            onClick={() => updateAppointmentStatus(a.id, 'em_andamento')}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Iniciar
                          </button>
                        )}
                        {a.status === 'em_andamento' && (
                          <button
                            onClick={() => updateAppointmentStatus(a.id, 'concluido')}
                            className="text-green-600 hover:text-green-800 text-sm"
                          >
                            Concluir
                          </button>
                        )}
                        <button
                          onClick={() => deleteAppointment(a.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Services; 