import React, { useState, useEffect } from 'react';
import { usePets } from '../hooks/usePets';
import PetForm from './PetForm';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Dog, 
  Cat, 
  AlertTriangle,
  X
} from 'lucide-react';

const PetList = ({ clientId, clientName, onPetAdded, onPetUpdated, onPetDeleted }) => {
  const { pets, loading, error, getPetsByClient, createPet, updatePet, deletePet } = usePets();
  const [showForm, setShowForm] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);

  // Carregar pets do cliente
  useEffect(() => {
    if (clientId) {
      loadClientPets();
    }
  }, [clientId]);

  const loadClientPets = async () => {
    try {
      const clientPets = await getPetsByClient(clientId);
      // Os pets já são atualizados no hook usePets
    } catch (error) {
      console.error('Erro ao carregar pets do cliente:', error);
    }
  };

  const handleCreatePet = async (petData) => {
    try {
      const newPet = await createPet({ ...petData, client_id: clientId });
      setShowForm(false);
      onPetAdded?.(newPet);
    } catch (error) {
      console.error('Erro ao criar pet:', error);
    }
  };

  const handleUpdatePet = async (petData) => {
    try {
      const updatedPet = await updatePet(editingPet.id, petData);
      setShowForm(false);
      setEditingPet(null);
      onPetUpdated?.(updatedPet);
    } catch (error) {
      console.error('Erro ao atualizar pet:', error);
    }
  };

  const handleDeletePet = async (petId) => {
    try {
      await deletePet(petId);
      setShowDeleteConfirm(null);
      onPetDeleted?.(petId);
    } catch (error) {
      console.error('Erro ao deletar pet:', error);
    }
  };

  const handleEditPet = (pet) => {
    setEditingPet(pet);
    setShowForm(true);
  };

  const handleViewPet = (pet) => {
    setSelectedPet(pet);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingPet(null);
  };

  const getSpeciesIcon = (species) => {
    switch (species?.toLowerCase()) {
      case 'cachorro':
        return <Dog className="w-4 h-4 text-blue-500" />;
      case 'gato':
        return <Cat className="w-4 h-4 text-orange-500" />;
      default:
        return <Dog className="w-4 h-4 text-gray-500" />;
    }
  };

  const clientPets = pets.filter(pet => pet.client_id == clientId);

  return (
    <div className="space-y-4">
      {/* Lista de Pets */}
      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Carregando pets...</p>
        </div>
      ) : clientPets.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Dog className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">Nenhum pet cadastrado</p>
          <p className="text-sm text-gray-500 mt-1">Nenhum pet encontrado para este cliente.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clientPets.map((pet) => (
            <div key={pet.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getSpeciesIcon(pet.species)}
                  <h4 className="font-medium text-gray-900">{pet.name}</h4>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleViewPet(pet)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="Ver detalhes"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEditPet(pet)}
                    className="text-green-600 hover:text-green-800 p-1"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(pet)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Deletar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Espécie:</span>
                  <span className="ml-1 text-gray-900">{pet.species}</span>
                </div>
                {pet.breed && (
                  <div>
                    <span className="text-gray-600">Raça:</span>
                    <span className="ml-1 text-gray-900">{pet.breed}</span>
                  </div>
                )}
                <div className="flex gap-4">
                  {pet.age && (
                    <div>
                      <span className="text-gray-600">Idade:</span>
                      <span className="ml-1 text-gray-900">{pet.age} anos</span>
                    </div>
                  )}
                  {pet.weight && (
                    <div>
                      <span className="text-gray-600">Peso:</span>
                      <span className="ml-1 text-gray-900">{pet.weight} kg</span>
                    </div>
                  )}
                </div>
                {pet.observations && (
                  <div>
                    <span className="text-gray-600">Obs:</span>
                    <span className="ml-1 text-gray-900 text-xs">{pet.observations}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Formulário */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-h-[90vh] overflow-y-auto">
            <PetForm
              pet={editingPet}
              onSave={editingPet ? handleUpdatePet : handleCreatePet}
              onCancel={handleCancelForm}
            />
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Delete */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Confirmar Exclusão
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir o pet <strong>{showDeleteConfirm.name}</strong>?
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeletePet(showDeleteConfirm.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes do Pet */}
      {selectedPet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                {getSpeciesIcon(selectedPet.species)}
                {selectedPet.name}
              </h3>
              <button
                onClick={() => setSelectedPet(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Espécie</label>
                  <p className="text-gray-900">{selectedPet.species}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Raça</label>
                  <p className="text-gray-900">{selectedPet.breed || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Idade</label>
                  <p className="text-gray-900">{selectedPet.age ? `${selectedPet.age} anos` : 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Peso</label>
                  <p className="text-gray-900">{selectedPet.weight ? `${selectedPet.weight} kg` : 'N/A'}</p>
                </div>
              </div>
              
              {selectedPet.observations && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Observações</label>
                  <p className="text-gray-900">{selectedPet.observations}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetList; 