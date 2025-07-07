import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { PawPrint } from 'lucide-react';
import { useClients } from '../hooks/useClients';

const PetForm = ({ pet, onSubmit, onCancel, hideButtons = false, customButtons, species = [], breeds = [] }) => {
  const [loading, setLoading] = useState(false);
  const { clients, loading: loadingClients } = useClients();
  const [speciesInput, setSpeciesInput] = useState(pet?.species || '');
  const [showSpeciesSuggestions, setShowSpeciesSuggestions] = useState(false);
  const [breedInput, setBreedInput] = useState(pet?.breed || '');
  const [showBreedSuggestions, setShowBreedSuggestions] = useState(false);
  const [selectedSpeciesIndex, setSelectedSpeciesIndex] = useState(-1);
  const [selectedBreedIndex, setSelectedBreedIndex] = useState(-1);

  const filteredSpecies = species.filter(s =>
    s.toLowerCase().includes(speciesInput.toLowerCase()) && s.trim() !== ''
  );
  const filteredBreeds = breeds.filter(b =>
    b.toLowerCase().includes(breedInput.toLowerCase()) && b.trim() !== ''
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

  // Atualiza o valor do species e breed no react-hook-form
  useEffect(() => {
    setValue('species', speciesInput);
  }, [speciesInput, setValue]);
  useEffect(() => {
    setValue('breed', breedInput);
  }, [breedInput, setValue]);

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

  // Funções de navegação por teclado para espécies
  const handleSpeciesKeyDown = (e) => {
    if (!showSpeciesSuggestions || filteredSpecies.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSpeciesIndex(prev => 
          prev < filteredSpecies.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSpeciesIndex(prev => 
          prev > 0 ? prev - 1 : filteredSpecies.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSpeciesIndex >= 0 && selectedSpeciesIndex < filteredSpecies.length) {
          const selectedSpecies = filteredSpecies[selectedSpeciesIndex];
          setSpeciesInput(selectedSpecies);
          setShowSpeciesSuggestions(false);
          setSelectedSpeciesIndex(-1);
          console.log('✅ Espécie selecionada via teclado:', selectedSpecies);
        } else if (filteredSpecies.length === 1) {
          // Se só há uma opção, selecionar automaticamente
          setSpeciesInput(filteredSpecies[0]);
          setShowSpeciesSuggestions(false);
          setSelectedSpeciesIndex(-1);
          console.log('✅ Única espécie selecionada:', filteredSpecies[0]);
        }
        break;
      case 'Escape':
        setShowSpeciesSuggestions(false);
        setSelectedSpeciesIndex(-1);
        break;
    }
  };

  // Funções de navegação por teclado para raças
  const handleBreedKeyDown = (e) => {
    if (!showBreedSuggestions || filteredBreeds.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedBreedIndex(prev => 
          prev < filteredBreeds.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedBreedIndex(prev => 
          prev > 0 ? prev - 1 : filteredBreeds.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedBreedIndex >= 0 && selectedBreedIndex < filteredBreeds.length) {
          const selectedBreed = filteredBreeds[selectedBreedIndex];
          setBreedInput(selectedBreed);
          setShowBreedSuggestions(false);
          setSelectedBreedIndex(-1);
          console.log('✅ Raça selecionada via teclado:', selectedBreed);
        } else if (filteredBreeds.length === 1) {
          // Se só há uma opção, selecionar automaticamente
          setBreedInput(filteredBreeds[0]);
          setShowBreedSuggestions(false);
          setSelectedBreedIndex(-1);
          console.log('✅ Única raça selecionada:', filteredBreeds[0]);
        }
        break;
      case 'Escape':
        setShowBreedSuggestions(false);
        setSelectedBreedIndex(-1);
        break;
    }
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
          <label htmlFor="client_id" className="block text-sm font-medium text-gray-700 mb-2">Dono *</label>
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
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
          <input
            type="text"
            {...register('name', { required: 'Nome é obrigatório' })}
            className="input-field"
            placeholder="Nome do pet"
            id="name"
            name="name"
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        <div className="relative">
          <label htmlFor="species" className="block text-sm font-medium text-gray-700 mb-2">
            Espécie
          </label>
          <input
            type="text"
            value={speciesInput}
            onChange={e => {
              const value = e.target.value;
              setSpeciesInput(value);
              setShowSpeciesSuggestions(true);
              setSelectedSpeciesIndex(-1);
              
              // Se há apenas uma opção e ela corresponde exatamente, selecionar automaticamente
              const filtered = species.filter(s =>
                s.toLowerCase().includes(value.toLowerCase()) && s.trim() !== ''
              );
              if (filtered.length === 1 && filtered[0].toLowerCase() === value.toLowerCase()) {
                setSelectedSpeciesIndex(0);
              }
            }}
            onFocus={() => setShowSpeciesSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSpeciesSuggestions(false), 150)}
            onKeyDown={handleSpeciesKeyDown}
            className="input-field"
            placeholder="Cachorro, Gato..."
            autoComplete="off"
            id="species"
            name="species"
          />
          {showSpeciesSuggestions && filteredSpecies.length > 0 && (
            <ul className="absolute z-20 bg-white border border-gray-200 rounded shadow-md mt-1 w-full max-h-40 overflow-auto">
              {filteredSpecies.map((s, index) => (
                <li
                  key={s}
                  className={`px-3 py-2 cursor-pointer transition-colors ${
                    index === selectedSpeciesIndex 
                      ? 'bg-blue-500 text-white font-medium' 
                      : 'hover:bg-gray-100'
                  }`}
                  onMouseDown={() => {
                    setSpeciesInput(s);
                    setShowSpeciesSuggestions(false);
                    setSelectedSpeciesIndex(-1);
                  }}
                >
                  {s}
                  {index === selectedSpeciesIndex && (
                    <span className="ml-2 text-xs">← Selecionado</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="relative">
          <label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-2">
            Raça
          </label>
          <input
            type="text"
            value={breedInput}
            onChange={e => {
              const value = e.target.value;
              setBreedInput(value);
              setShowBreedSuggestions(true);
              setSelectedBreedIndex(-1);
              
              // Se há apenas uma opção e ela corresponde exatamente, selecionar automaticamente
              const filtered = breeds.filter(b =>
                b.toLowerCase().includes(value.toLowerCase()) && b.trim() !== ''
              );
              if (filtered.length === 1 && filtered[0].toLowerCase() === value.toLowerCase()) {
                setSelectedBreedIndex(0);
              }
            }}
            onFocus={() => setShowBreedSuggestions(true)}
            onBlur={() => setTimeout(() => setShowBreedSuggestions(false), 150)}
            onKeyDown={handleBreedKeyDown}
            className="input-field"
            placeholder="Raça do pet"
            autoComplete="off"
            id="breed"
            name="breed"
          />
          {showBreedSuggestions && filteredBreeds.length > 0 && (
            <ul className="absolute z-20 bg-white border border-gray-200 rounded shadow-md mt-1 w-full max-h-40 overflow-auto">
              {filteredBreeds.map((b, index) => (
                <li
                  key={b}
                  className={`px-3 py-2 cursor-pointer transition-colors ${
                    index === selectedBreedIndex 
                      ? 'bg-blue-500 text-white font-medium' 
                      : 'hover:bg-gray-100'
                    }`}
                  onMouseDown={() => {
                    setBreedInput(b);
                    setShowBreedSuggestions(false);
                    setSelectedBreedIndex(-1);
                  }}
                >
                  {b}
                  {index === selectedBreedIndex && (
                    <span className="ml-2 text-xs">← Selecionado</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">Cor</label>
          <input
            type="text"
            {...register('color')}
            className="input-field"
            placeholder="Cor do pet"
            id="color"
            name="color"
          />
        </div>
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">Sexo</label>
          <select {...register('gender')} className="input-field" id="gender" name="gender">
            <option value="">Selecione...</option>
            <option value="M">Macho</option>
            <option value="F">Fêmea</option>
          </select>
        </div>
        <div>
          <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-2">Data de Nascimento</label>
          <input
            type="date"
            {...register('birthdate')}
            className="input-field"
            id="birthdate"
            name="birthdate"
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
          <textarea
            {...register('notes')}
            className="input-field"
            placeholder="Observações sobre o pet"
            rows={2}
            id="notes"
            name="notes"
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