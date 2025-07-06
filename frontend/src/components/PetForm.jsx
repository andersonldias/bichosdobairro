import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { PawPrint } from 'lucide-react';
import { useClients } from '../hooks/useClients';

const PetForm = ({ pet, onSubmit, onCancel, hideButtons = false, customButtons, species = [] }) => {
  const [loading, setLoading] = useState(false);
  const { clients, loading: loadingClients } = useClients();
  const [speciesInput, setSpeciesInput] = useState(pet?.species || '');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSpecies = species.filter(s =>
    s.toLowerCase().includes(speciesInput.toLowerCase()) && s.trim() !== ''
  );

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
      client_id: pet?.client_id || (pet && pet.client_id ? pet.client_id : '')
    }
  });

  useEffect(() => {
    if (pet && pet.client_id) {
      setValue('client_id', pet.client_id);
    }
  }, [pet, setValue]);

  // Atualiza o valor do species no react-hook-form
  useEffect(() => {
    setValue('species', speciesInput);
  }, [speciesInput, setValue]);

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

  const handleFormSubmitWrapper = (e) => {
    e.preventDefault();
    handleSubmit(handleFormSubmit)(e);
  };

  return (
    <form data-pet-form onSubmit={handleFormSubmitWrapper} className="p-4 bg-gray-50 rounded-lg border space-y-6">
      <div className="flex items-center mb-2">
        <PawPrint className="w-5 h-5 mr-2 text-green-500" />
        <h3 className="text-lg font-semibold text-gray-900">
          {pet && pet.name ? 'Editar Pet' : 'Novo Pet'}
        </h3>
      </div>
      {/* Dono do Pet - Apenas se for um cliente existente */}
      {pet && pet.client_id ? (
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
      ) : null}

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
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Espécie</label>
          <input
            type="text"
            value={speciesInput}
            onChange={e => {
              setSpeciesInput(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            className="input-field"
            placeholder="Cachorro, Gato..."
            autoComplete="off"
            name="species"
          />
          {showSuggestions && filteredSpecies.length > 0 && (
            <ul className="absolute z-20 bg-white border border-gray-200 rounded shadow-md mt-1 w-full max-h-40 overflow-auto">
              {filteredSpecies.map(s => (
                <li
                  key={s}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                  onMouseDown={() => {
                    setSpeciesInput(s);
                    setShowSuggestions(false);
                  }}
                >
                  {s}
                </li>
              ))}
            </ul>
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
      {!hideButtons && (
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
            {pet && pet.name ? 'Atualizar' : 'Cadastrar'}
          </button>
        </div>
      )}
      {customButtons}
    </form>
  );
};

export default PetForm; 