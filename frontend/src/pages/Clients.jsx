import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useClients } from '../hooks/useClients';
import ClientForm from '../components/ClientForm';

const Clients = () => {
  const { 
    clients, 
    loading, 
    error, 
    stats,
    createClient, 
    updateClient, 
    deleteClient, 
    searchClients 
  } = useClients();
  
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchClients(query);
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleDelete = async (clientId) => {
    try {
      await deleteClient(clientId);
      setShowDeleteModal(null);
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
    }
  };

  const handleFormSubmit = async (clientData) => {
    try {
      console.log('📋 Clients.handleFormSubmit - Dados recebidos:', clientData);
      if (editingClient) {
        await updateClient(editingClient.id, clientData);
      } else {
        await createClient(clientData);
      }
      setShowForm(false);
      setEditingClient(null);
    } catch (error) {
      console.error('❌ Clients.handleFormSubmit - Erro:', error);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingClient(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600">
            {loading ? 'Carregando...' : `${clients.length} clientes cadastrados`}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </button>
      </div>

      {/* Mensagem de Erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total de Clientes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_clients || 0}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Novos Hoje</p>
                <p className="text-2xl font-bold text-gray-900">{stats.new_today || 0}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Dias com Novos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.days_with_new_clients || 0}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Barra de Busca */}
      <div className="card">
        <div className="relative">
          <label htmlFor="clientSearch" className="block text-sm font-medium text-gray-700 mb-1">Buscar Cliente</label>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            id="clientSearch"
            name="clientSearch"
            type="text"
            placeholder="Buscar clientes por nome, CPF ou telefone..."
            value={searchQuery}
            onChange={handleSearch}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Lista de Clientes */}
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            <span className="ml-2 text-gray-600">Carregando clientes...</span>
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
            </h3>
            <p className="text-gray-500">
              {searchQuery 
                ? 'Tente ajustar os termos de busca'
                : 'Comece cadastrando seu primeiro cliente'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Nome</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">CPF</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Telefone</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Pets</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{client.name}</p>
                        <p className="text-sm text-gray-500">{client.city}, {client.state}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{client.cpf}</td>
                    <td className="py-3 px-4 text-gray-600">{client.phone}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {client.pets_count || 0} pets
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(client)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteModal(client)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Formulário */}
      {showForm && (
        <ClientForm
          client={editingClient}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirmar Exclusão
            </h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir o cliente "{showDeleteModal.name}"? 
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal.id)}
                className="btn-danger"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients; 