import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, PawPrint } from 'lucide-react';
import { useClients } from '../hooks/useClients';

const PetForm = ({ pet, onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const { clients, loading: loadingClients } = useClients();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: pet?.name || '',
      species: pet?.species || '',
      breed: pet?.breed || '',
      color: pet?.color || '',
      gender: pet?.gender || '',
      birthdate: pet?.birthdate || '',
      notes: pet?.notes || '',
      client_id: pet?.client_id || ''
    }
  });

  useEffect(() => {
    if (pet) {
      setValue('client_id', pet.client_id);
    }
  }, [pet, setValue]);

  const handleFormSubmit = async (data) => {
    setLoading(true);
    try {
      await onSubmit(data);
    } catch (error) {
      // erro já tratado no hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <PawPrint className="w-6 h-6 mr-2 text-green-500" />
            {pet ? 'Editar Pet' : 'Novo Pet'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
          {/* Dono do Pet */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dono *</label>
            <select
              {...register('client_id', { required: 'Selecione o dono do pet' })}
              className="input-field"
              disabled={loadingClients}
            >
              <option value="">Selecione o cliente...</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} ({client.phone})
                </option>
              ))}
            </select>
            {errors.client_id && (
              <p className="text-red-600 text-sm mt-1">{errors.client_id.message}</p>
            )}
          </div>

          {/* Dados do Pet */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
              <input
                type="text"
                {...register('name', { required: 'Nome é obrigatório' })}
                className="input-field"
                placeholder="Nome do pet"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Espécie *</label>
              <input
                type="text"
                {...register('species', { required: 'Espécie é obrigatória' })}
                className="input-field"
                placeholder="Cachorro, Gato..."
              />
              {errors.species && (
                <p className="text-red-600 text-sm mt-1">{errors.species.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Raça</label>
              <input
                type="text"
                {...register('breed')}
                className="input-field"
                placeholder="Raça do pet"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cor</label>
              <input
                type="text"
                {...register('color')}
                className="input-field"
                placeholder="Cor do pet"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sexo</label>
              <select {...register('gender')} className="input-field">
                <option value="">Selecione...</option>
                <option value="M">Macho</option>
                <option value="F">Fêmea</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data de Nascimento</label>
              <input
                type="date"
                {...register('birthdate')}
                className="input-field"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
              <textarea
                {...register('notes')}
                className="input-field"
                placeholder="Observações sobre o pet"
                rows={2}
              />
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center"
              disabled={loading}
            >
              {loading && <span className="mr-2">Salvando...</span>}
              {pet ? 'Atualizar' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PetForm; 