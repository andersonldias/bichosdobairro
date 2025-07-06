import React, { useState } from 'react';
import { Scissors, Plus, Loader2, AlertCircle, Edit, Trash2 } from 'lucide-react';
import { useServiceTypes } from '../hooks/useServiceTypes';

const Services = () => {
  const { serviceTypes, loading, error, createServiceType, updateServiceType, deleteServiceType } = useServiceTypes();

  // Formulário de cadastro
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name) return;
    try {
      await createServiceType({ name, description });
      setName('');
      setDescription('');
    } catch (err) {
      alert('Erro ao cadastrar tipo de serviço.');
    }
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    if (!editName) return;
    try {
      await updateServiceType(editId, { name: editName, description: editDescription });
      setEditId(null);
      setEditName('');
      setEditDescription('');
    } catch (err) {
      alert('Erro ao atualizar tipo de serviço.');
    }
  }

  async function handleDelete(id) {
    if (window.confirm('Tem certeza que deseja excluir este tipo de serviço?')) {
      try {
        await deleteServiceType(id);
      } catch (err) {
        alert('Erro ao excluir tipo de serviço.');
      }
    }
  }

  function startEdit(st) {
    setEditId(st.id);
    setEditName(st.name);
    setEditDescription(st.description || '');
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Scissors /> Tipos de Serviços</h1>

      {/* Formulário de cadastro */}
      <form className="card space-y-4" onSubmit={editId ? handleEditSubmit : handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Serviço</label>
          <input
            type="text"
            className="input-field"
            value={editId ? editName : name}
            onChange={e => editId ? setEditName(e.target.value) : setName(e.target.value)}
            placeholder="Ex: Banho, Tosa, Consulta"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <textarea
            className="input-field"
            value={editId ? editDescription : description}
            onChange={e => editId ? setEditDescription(e.target.value) : setDescription(e.target.value)}
            placeholder="Descrição do serviço (opcional)"
          />
        </div>
        <button type="submit" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> {editId ? 'Salvar Alterações' : 'Cadastrar Tipo de Serviço'}
        </button>
        {editId && (
          <button type="button" className="btn-secondary ml-2" onClick={() => setEditId(null)}>
            Cancelar edição
          </button>
        )}
      </form>

      {/* Lista de tipos de serviço */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Tipos de Serviço Cadastrados</h2>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            <span className="ml-2 text-gray-600">Carregando tipos de serviço...</span>
          </div>
        ) : serviceTypes.length === 0 ? (
          <div className="text-center text-gray-500 py-8">Nenhum tipo de serviço cadastrado.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 px-3 text-left">Nome</th>
                <th className="py-2 px-3 text-left">Descrição</th>
                <th className="py-2 px-3 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {serviceTypes.map(st => (
                <tr key={st.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-3">{st.name}</td>
                  <td className="py-2 px-3">{st.description}</td>
                  <td className="py-2 px-3">
                    <button className="p-1 text-blue-600 hover:bg-blue-50 rounded mr-2" onClick={() => startEdit(st)} title="Editar"><Edit className="w-4 h-4" /></button>
                    <button className="p-1 text-red-600 hover:bg-red-50 rounded" onClick={() => handleDelete(st.id)} title="Excluir"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Services; 