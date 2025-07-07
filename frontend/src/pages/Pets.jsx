import React, { useState, useEffect } from 'react';
import { PawPrint, Plus, Search, Edit, Trash2, Loader2, AlertCircle, User, BarChart3 } from 'lucide-react';
import { usePets } from '../hooks/usePets';
import { useClients } from '../hooks/useClients';
import PetForm from '../components/PetForm';

const Pets = () => {
  const { pets, loading, error, createPet, updatePet, deletePet, searchPets, stats, species, breeds } = usePets();
  const { clients } = useClients();
  const [showForm, setShowForm] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [filterSpecies, setFilterSpecies] = useState('');
  const [filterBreed, setFilterBreed] = useState('');
  const [filterClient, setFilterClient] = useState('');
  const [showSpeciesFilter, setShowSpeciesFilter] = useState(false);
  const [showBreedFilter, setShowBreedFilter] = useState(false);
  const [showClientFilter, setShowClientFilter] = useState(false);
  const [selectedSpeciesFilterIndex, setSelectedSpeciesFilterIndex] = useState(-1);
  const [selectedBreedFilterIndex, setSelectedBreedFilterIndex] = useState(-1);
  const [selectedClientFilterIndex, setSelectedClientFilterIndex] = useState(-1);

  // Filtro avançado local
  const filteredPets = pets.filter((pet) => {
    return (
      (!filterSpecies || pet.species === filterSpecies) &&
      (!filterBreed || pet.breed === filterBreed) &&
      (!filterClient || String(pet.client_id) === filterClient)
    );
  });

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchPets(query);
  };

  // Handlers para navegação por teclado nos filtros
  const handleSpeciesFilterKeyDown = (e) => {
    if (!showSpeciesFilter || species.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSpeciesFilterIndex(prev =>
          prev < species.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSpeciesFilterIndex(prev =>
          prev > 0 ? prev - 1 : species.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSpeciesFilterIndex >= 0 && selectedSpeciesFilterIndex < species.length) {
          const selectedSpecies = species[selectedSpeciesFilterIndex];
          setFilterSpecies(selectedSpecies);
          setShowSpeciesFilter(false);
          setSelectedSpeciesFilterIndex(-1);
          console.log('✅ Filtro de espécie selecionado via teclado:', selectedSpecies);
        }
        break;
      case 'Escape':
        setShowSpeciesFilter(false);
        setSelectedSpeciesFilterIndex(-1);
        break;
    }
  };

  const handleBreedFilterKeyDown = (e) => {
    if (!showBreedFilter || breeds.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedBreedFilterIndex(prev =>
          prev < breeds.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedBreedFilterIndex(prev =>
          prev > 0 ? prev - 1 : breeds.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedBreedFilterIndex >= 0 && selectedBreedFilterIndex < breeds.length) {
          const selectedBreed = breeds[selectedBreedFilterIndex];
          setFilterBreed(selectedBreed);
          setShowBreedFilter(false);
          setSelectedBreedFilterIndex(-1);
          console.log('✅ Filtro de raça selecionado via teclado:', selectedBreed);
        }
        break;
      case 'Escape':
        setShowBreedFilter(false);
        setSelectedBreedFilterIndex(-1);
        break;
    }
  };

  const handleClientFilterKeyDown = (e) => {
    if (!showClientFilter || clients.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedClientFilterIndex(prev =>
          prev < clients.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedClientFilterIndex(prev =>
          prev > 0 ? prev - 1 : clients.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedClientFilterIndex >= 0 && selectedClientFilterIndex < clients.length) {
          const selectedClient = clients[selectedClientFilterIndex];
          setFilterClient(selectedClient.id);
          setShowClientFilter(false);
          setSelectedClientFilterIndex(-1);
          console.log('✅ Filtro de cliente selecionado via teclado:', selectedClient.name);
        }
        break;
      case 'Escape':
        setShowClientFilter(false);
        setSelectedClientFilterIndex(-1);
        break;
    }
  };

  const handleEdit = (pet) => {
    setEditingPet(pet);
    setShowForm(true);
  };

  const handleDelete = async (petId) => {
    try {
      await deletePet(petId);
      setShowDeleteModal(null);
    } catch (error) {
      // erro já tratado
    }
  };

  const handleFormSubmit = async (petData) => {
    try {
      if (editingPet) {
        await updatePet(editingPet.id, petData);
      } else {
        await createPet(petData);
      }
      setShowForm(false);
      setEditingPet(null);
    } catch (error) {
      // erro já tratado
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingPet(null);
  };

  useEffect(() => {
    if (!showForm) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setShowForm(false);
        setEditingPet(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showForm]);

  useEffect(() => {
    if (!showDeleteModal) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setShowDeleteModal(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showDeleteModal]);

  return (
    <div className="space-y-6">
      {/* Estatísticas de Pets */}
      {stats && Array.isArray(stats) && stats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card flex items-center">
            <PawPrint className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total de Pets</p>
              <p className="text-2xl font-bold text-gray-900">{stats.reduce((acc, s) => acc + (s.count_by_species || 0), 0)}</p>
            </div>
          </div>
          <div className="card flex items-center">
            <BarChart3 className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Espécies</p>
              <p className="text-2xl font-bold text-gray-900">{stats.length}</p>
            </div>
          </div>
          <div className="card flex items-center">
            <BarChart3 className="w-8 h-8 text-purple-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Espécie mais comum</p>
              <p className="text-2xl font-bold text-gray-900">{stats[0]?.species || '-'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pets</h1>
          <p className="text-gray-600">
            {loading ? 'Carregando...' : `${filteredPets.length} pets encontrados`}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Pet
        </button>
      </div>

      {/* Filtros Avançados */}
      <div className="card flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-1 relative">
          <label htmlFor="speciesFilter" className="block text-sm font-medium text-gray-700 mb-1">
            Espécie
          </label>
          <input
            id="speciesFilter"
            name="speciesFilter"
            type="text"
            placeholder="Filtrar por espécie..."
            value={filterSpecies}
            onChange={(e) => {
              setFilterSpecies(e.target.value);
              setShowSpeciesFilter(true);
              setSelectedSpeciesFilterIndex(-1);
            }}
            onKeyDown={handleSpeciesFilterKeyDown}
            onFocus={() => {
              setShowSpeciesFilter(true);
              setSelectedSpeciesFilterIndex(-1);
            }}
            onBlur={() => setTimeout(() => setShowSpeciesFilter(false), 150)}
            className="input-field"
            autoComplete="off"
          />
          {showSpeciesFilter && species.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {species.map((s, index) => (
                <div
                  key={s}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                    index === selectedSpeciesFilterIndex ? 'bg-blue-100 text-blue-900' : ''
                  }`}
                  onClick={() => {
                    setFilterSpecies(s);
                    setShowSpeciesFilter(false);
                    setSelectedSpeciesFilterIndex(-1);
                  }}
                >
                  {s}
                  {index === selectedSpeciesFilterIndex && (
                    <span className="ml-2 text-blue-600">← Selecionado</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex-1 relative">
          <label htmlFor="breedFilter" className="block text-sm font-medium text-gray-700 mb-1">
            Raça
          </label>
          <input
            id="breedFilter"
            name="breedFilter"
            type="text"
            placeholder="Filtrar por raça..."
            value={filterBreed}
            onChange={(e) => {
              setFilterBreed(e.target.value);
              setShowBreedFilter(true);
              setSelectedBreedFilterIndex(-1);
            }}
            onKeyDown={handleBreedFilterKeyDown}
            onFocus={() => {
              setShowBreedFilter(true);
              setSelectedBreedFilterIndex(-1);
            }}
            onBlur={() => setTimeout(() => setShowBreedFilter(false), 150)}
            className="input-field"
            autoComplete="off"
          />
          {showBreedFilter && breeds.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {breeds.map((b, index) => (
                <div
                  key={b}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                    index === selectedBreedFilterIndex ? 'bg-blue-100 text-blue-900' : ''
                  }`}
                  onClick={() => {
                    setFilterBreed(b);
                    setShowBreedFilter(false);
                    setSelectedBreedFilterIndex(-1);
                  }}
                >
                  {b}
                  {index === selectedBreedFilterIndex && (
                    <span className="ml-2 text-blue-600">← Selecionado</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex-1 relative">
          <label htmlFor="clientFilter" className="block text-sm font-medium text-gray-700 mb-1">
            Dono
          </label>
          <input
            id="clientFilter"
            name="clientFilter"
            type="text"
            placeholder="Filtrar por dono..."
            value={clients.find(c => c.id == filterClient)?.name || ''}
            onChange={(e) => {
              const clientName = e.target.value;
              const client = clients.find(c => c.name.toLowerCase().includes(clientName.toLowerCase()));
              setFilterClient(client ? client.id : '');
              setShowClientFilter(true);
              setSelectedClientFilterIndex(-1);
            }}
            onKeyDown={handleClientFilterKeyDown}
            onFocus={() => {
              setShowClientFilter(true);
              setSelectedClientFilterIndex(-1);
            }}
            onBlur={() => setTimeout(() => setShowClientFilter(false), 150)}
            className="input-field"
            autoComplete="off"
          />
          {showClientFilter && clients.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {clients.map((c, index) => (
                <div
                  key={c.id}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                    index === selectedClientFilterIndex ? 'bg-blue-100 text-blue-900' : ''
                  }`}
                  onClick={() => {
                    setFilterClient(c.id);
                    setShowClientFilter(false);
                    setSelectedClientFilterIndex(-1);
                  }}
                >
                  {c.name}
                  {index === selectedClientFilterIndex && (
                    <span className="ml-2 text-blue-600">← Selecionado</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Barra de Busca */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar pets por nome, espécie, raça ou dono..."
            value={searchQuery}
            onChange={handleSearch}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Lista de Pets */}
      <div className="card overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            <span className="ml-2 text-gray-600">Carregando pets...</span>
          </div>
        ) : filteredPets.length === 0 ? (
          <div className="text-center py-12">
            <PawPrint className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'Nenhum pet encontrado' : 'Nenhum pet cadastrado'}
            </h3>
            <p className="text-gray-500">
              {searchQuery 
                ? 'Tente ajustar os termos de busca'
                : 'Comece cadastrando seu primeiro pet'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Agrupar pets por cliente */}
            {(() => {
              const petsByClient = {};
              filteredPets.forEach(pet => {
                const clientId = pet.client_id;
                if (!petsByClient[clientId]) {
                  petsByClient[clientId] = [];
                }
                petsByClient[clientId].push(pet);
              });

              return Object.entries(petsByClient).map(([clientId, clientPets]) => {
                const client = clients.find(c => c.id == clientId);
                const clientName = client ? client.name : 'Cliente não encontrado';
                const clientPhone = client ? client.phone : '';

                return (
                  <div key={clientId} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Header do Cliente */}
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <User className="w-5 h-5 text-blue-500" />
                          <div>
                            <h3 className="font-semibold text-gray-900">{clientName}</h3>
                            <p className="text-sm text-gray-600">{clientPhone}</p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {clientPets.length} pet{clientPets.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>

                    {/* Lista de Pets do Cliente */}
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {clientPets.map((pet) => (
                          <div key={pet.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <PawPrint className="w-4 h-4 text-green-500" />
                                <h4 className="font-medium text-gray-900">{pet.name}</h4>
                              </div>
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => handleEdit(pet)}
                                  className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                  title="Editar"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setShowDeleteModal(pet)}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                  title="Excluir"
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
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        )}
      </div>

      {/* Modal de Formulário */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-lg relative">
            <button
              onClick={handleFormCancel}
              className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors z-10"
              aria-label="Fechar"
            >
              <span style={{fontSize: 24, fontWeight: 'bold'}}>&times;</span>
            </button>
            <PetForm
              pet={editingPet}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              species={species}
              breeds={breeds}
            />
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirmar Exclusão
            </h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir o pet "{showDeleteModal.name}"?
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

export default Pets; 