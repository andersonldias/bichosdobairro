import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, MapPin, Loader2 } from 'lucide-react';
import PetForm from './PetForm';
import { usePets } from '../hooks/usePets';
import axios from 'axios';

function formatCPF(value) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .slice(0, 14);
}

function formatPhone(value) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15);
}

function formatCEP(value) {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{5})(\d{0,3})$/, (match, p1, p2) => p2 ? `${p1}-${p2}` : p1)
    .slice(0, 9);
}

const ClientForm = ({ client, onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const { pets, loading: loadingPets, createPet, updatePet, deletePet, loadPets, species, breeds } = usePets();
  const [showPetForm, setShowPetForm] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [duplicateName, setDuplicateName] = useState(null);
  const [duplicateCpf, setDuplicateCpf] = useState(null);
  const [duplicatePhone, setDuplicatePhone] = useState(null);
  const [newPets, setNewPets] = useState([]);
  const [petFormResetKey, setPetFormResetKey] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: client?.name || '',
      cpf: client?.cpf || '',
      phone: client?.phone || '',
      cep: client?.cep || '',
      street: client?.street || '',
      neighborhood: client?.neighborhood || '',
      city: client?.city || '',
      state: client?.state || '',
      number: client?.number || ''
    }
  });

  const cep = watch('cep');

  // Filtrar pets do cliente atual
  const clientPets = client ? pets.filter(p => p.client_id === client.id) : [];

  // Carregar pets quando o componente é montado para clientes existentes
  useEffect(() => {
    if (client && client.id) {
      loadPets();
    }
  }, [client, loadPets]);

  // Buscar endereço pelo CEP
  useEffect(() => {
    const fetchAddress = async () => {
      const cleanCep = (cep || '').replace(/\D/g, '');
      if (cleanCep.length === 8) {
        setAddressLoading(true);
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
          const data = await response.json();
          if (!data.erro) {
            setValue('street', data.logradouro);
            setValue('neighborhood', data.bairro);
            setValue('city', data.localidade);
            setValue('state', data.uf);
          }
        } catch (error) {
          console.error('Erro ao buscar CEP:', error);
        } finally {
          setAddressLoading(false);
        }
      }
    };

    fetchAddress();
  }, [cep, setValue]);

  const handleFormSubmit = async (data) => {
    setLoading(true);
    try {
      // Remove máscara do CEP antes de enviar
      const cleanCep = (data.cep || '').replace(/\D/g, '');
      await onSubmit({ ...data, cep: cleanCep, pets: newPets });
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePet = async () => {
    setLoading(true);
    try {
      // Pegar os dados do formulário de pet
      const petForm = document.querySelector('form[data-pet-form]');
      if (petForm) {
        const formData = new FormData(petForm);
        const petData = {
          name: formData.get('name'),
          species: formData.get('species'),
          breed: formData.get('breed'),
          color: formData.get('color'),
          gender: formData.get('gender'),
          birthdate: formData.get('birthdate'),
          notes: formData.get('notes')
        };
        await handlePetFormSubmit(petData);
        // Não fechar o formulário para permitir adicionar múltiplos pets
        // O formulário será resetado automaticamente pelo handlePetFormSubmit
      }
    } catch (error) {
      console.error('Erro ao salvar pet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPet = () => {
    setEditingPet(null);
    setShowPetForm(true);
    // Resetar o formulário para um novo pet
    setPetFormResetKey(prev => prev + 1);
  };

  const handleEditPet = (pet, idx) => {
    setEditingPet({ ...pet, idx });
    setShowPetForm(true);
    setPetFormResetKey(prev => prev + 1);
  };

  const handleDeletePet = (idx) => {
    if (client) {
      // Para clientes existentes, usar deletePet do hook
      const petToDelete = clientPets[idx];
      if (petToDelete && petToDelete.id) {
        deletePet(petToDelete.id);
      }
    } else {
      // Para novos clientes, usar estado local
      setNewPets(newPets.filter((_, i) => i !== idx));
    }
  };

  const handlePetFormSubmit = (petData, { keepOpen = false } = {}) => {
    if (client) {
      // Para clientes existentes, usar createPet/updatePet do hook
      if (editingPet && editingPet.id) {
        updatePet(editingPet.id, petData);
        if (!keepOpen) {
          setShowPetForm(false);
          setEditingPet(null);
        }
      } else {
        createPet({ ...petData, client_id: client.id });
        if (!keepOpen) {
          setShowPetForm(false);
          setEditingPet(null);
        }
      }
    } else {
      // Para novos clientes, usar estado local
      if (editingPet && editingPet.idx !== undefined) {
        setNewPets(newPets.map((p, i) => (i === editingPet.idx ? petData : p)));
        if (!keepOpen) {
          setShowPetForm(false);
          setEditingPet(null);
        }
      } else {
        setNewPets([...newPets, petData]);
        setEditingPet(null);
        setPetFormResetKey(prev => prev + 1);
        if (!keepOpen) {
          setShowPetForm(false);
        }
      }
    }
  };

  const handlePetFormCancel = () => {
    console.log('PetForm cancel'); // Debug
    setShowPetForm(false);
    setEditingPet(null);
  };

  async function checkDuplicate(field, value) {
    if (!value) return;
    try {
      const res = await axios.post('/api/clients/check-duplicate-field', { field, value });
      console.log('Resposta duplicidade', field, value, res.data);
      if (field === 'name') setDuplicateName(res.data.duplicate ? res.data.client : null);
      if (field === 'cpf') setDuplicateCpf(res.data.duplicate ? res.data.client : null);
      if (field === 'phone') setDuplicatePhone(res.data.duplicate ? res.data.client : null);
    } catch (e) {
      console.error('Erro ao checar duplicidade', field, value, e);
    }
  }

  const [formValues, setFormValues] = useState({
    cpf: client?.cpf || '',
    phone: client?.phone || '',
    cep: client?.cep || ''
  });

  const handleCpfChange = (e) => {
    const formatted = formatCPF(e.target.value);
    setFormValues((prev) => ({ ...prev, cpf: formatted }));
    setValue('cpf', formatted);
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setFormValues((prev) => ({ ...prev, phone: formatted }));
    setValue('phone', formatted);
  };

  const handleCepChange = (e) => {
    const formatted = formatCEP(e.target.value);
    setFormValues((prev) => ({ ...prev, cep: formatted }));
    setValue('cep', formatted);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {client ? 'Editar Cliente' : 'Novo Cliente'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form id="client-form" onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
          {/* Informações Básicas */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Básicas</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  {...register('name', { required: 'Nome é obrigatório' })}
                  className="input-field"
                  placeholder="Digite o nome completo"
                  onBlur={e => checkDuplicate('name', e.target.value)}
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                )}
                {duplicateName && (
                  <p className="text-red-600 text-sm mt-1">Já existe um cliente com este nome!</p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CPF *
                  </label>
                  <input
                    type="text"
                    {...register('cpf', { 
                      required: 'CPF é obrigatório',
                      pattern: {
                        value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                        message: 'CPF deve estar no formato 000.000.000-00'
                      }
                    })}
                    className="input-field"
                    placeholder="000.000.000-00"
                    value={formValues.cpf}
                    onChange={handleCpfChange}
                    onBlur={e => checkDuplicate('cpf', e.target.value.replace(/\D/g, ''))}
                  />
                  {errors.cpf && (
                    <p className="text-red-600 text-sm mt-1">{errors.cpf.message}</p>
                  )}
                  {duplicateCpf && (
                    <p className="text-red-600 text-sm mt-1">Já existe um cliente com este CPF!</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone *
                  </label>
                  <input
                    type="text"
                    {...register('phone', { 
                      required: 'Telefone é obrigatório',
                      pattern: {
                        value: /^\(\d{2}\) \d{5}-\d{4}$/,
                        message: 'Telefone deve estar no formato (00) 00000-0000'
                      }
                    })}
                    className="input-field"
                    placeholder="(00) 00000-0000"
                    value={formValues.phone}
                    onChange={handlePhoneChange}
                    onBlur={e => checkDuplicate('phone', e.target.value.replace(/\D/g, ''))}
                  />
                  {errors.phone && (
                    <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
                  )}
                  {duplicatePhone && (
                    <p className="text-red-600 text-sm mt-1">Já existe um cliente com este telefone!</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Endereço
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CEP
                </label>
                <div className="relative">
                  <input
                    type="text"
                    {...register('cep')}
                    className="input-field"
                    placeholder="00000-000"
                    value={formValues.cep}
                    onChange={handleCepChange}
                  />
                  {addressLoading && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número *
                </label>
                <input
                  type="text"
                  {...register('number', { required: 'Número é obrigatório' })}
                  className="input-field"
                  placeholder="123"
                />
                {errors.number && (
                  <p className="text-red-600 text-sm mt-1">{errors.number.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rua
                </label>
                <input
                  type="text"
                  {...register('street')}
                  className="input-field"
                  placeholder="Rua das Flores"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bairro
                </label>
                <input
                  type="text"
                  {...register('neighborhood')}
                  className="input-field"
                  placeholder="Centro"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade
                </label>
                <input
                  type="text"
                  {...register('city')}
                  className="input-field"
                  placeholder="São Paulo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  {...register('state')}
                  className="input-field"
                >
                  <option value="">Selecione...</option>
                  <option value="AC">Acre</option>
                  <option value="AL">Alagoas</option>
                  <option value="AP">Amapá</option>
                  <option value="AM">Amazonas</option>
                  <option value="BA">Bahia</option>
                  <option value="CE">Ceará</option>
                  <option value="DF">Distrito Federal</option>
                  <option value="ES">Espírito Santo</option>
                  <option value="GO">Goiás</option>
                  <option value="MA">Maranhão</option>
                  <option value="MT">Mato Grosso</option>
                  <option value="MS">Mato Grosso do Sul</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="PA">Pará</option>
                  <option value="PB">Paraíba</option>
                  <option value="PR">Paraná</option>
                  <option value="PE">Pernambuco</option>
                  <option value="PI">Piauí</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="RN">Rio Grande do Norte</option>
                  <option value="RS">Rio Grande do Sul</option>
                  <option value="RO">Rondônia</option>
                  <option value="RR">Roraima</option>
                  <option value="SC">Santa Catarina</option>
                  <option value="SP">São Paulo</option>
                  <option value="SE">Sergipe</option>
                  <option value="TO">Tocantins</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pets do Cliente */}
          {client && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <span className="mr-2">🐾</span> Pets do Cliente
              </h3>
              {loadingPets ? (
                <div className="text-gray-500">Carregando pets...</div>
              ) : clientPets.length === 0 ? (
                <div className="text-gray-500">Nenhum pet cadastrado para este cliente.</div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {clientPets.map((pet) => (
                    <li key={pet.id} className="flex items-center justify-between py-2">
                      <div>
                        <span className="font-medium text-gray-900">{pet.name}</span>
                        <span className="text-gray-500 ml-2">({pet.species} - {pet.breed})</span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          className="btn-secondary px-2 py-1"
                          onClick={() => handleEditPet(pet, clientPets.indexOf(pet))}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="btn-danger px-2 py-1"
                          onClick={() => handleDeletePet(clientPets.indexOf(pet))}
                        >
                          Excluir
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {showPetForm && (
                <div className="mb-4">
                  <PetForm
                    key={petFormResetKey}
                    pet={editingPet || {}}
                    onSubmit={petData => {
                      handlePetFormSubmit(petData, { keepOpen: true });
                    }}
                    onCancel={() => {}}
                    hideButtons={true}
                    resetKey={petFormResetKey}
                    species={species}
                    breeds={breeds}
                  />
                </div>
              )}
            </div>
          )}

        </form>

        {/* Cadastro de Pets - Apenas para novos clientes (FORA DO FORMULÁRIO) */}
        {!client && (
          <div className="p-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Pets do Cliente</h3>
            {newPets.length > 0 && (
              <ul className="mb-4">
                {newPets.map((pet, idx) => (
                  <li key={idx} className="flex items-center justify-between py-1">
                    <span>{pet.name} ({pet.species})</span>
                    <div className="space-x-2">
                      <button type="button" className="text-blue-600" onClick={() => handleEditPet(pet, idx)}>Editar</button>
                      <button type="button" className="text-red-600" onClick={() => handleDeletePet(idx)}>Remover</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {showPetForm && (
              <div className="mb-4">
                <PetForm
                  key={petFormResetKey}
                  pet={editingPet || {}}
                  onSubmit={petData => {
                    handlePetFormSubmit(petData, { keepOpen: true });
                  }}
                  onCancel={() => {}}
                  hideButtons={true}
                  resetKey={petFormResetKey}
                  species={species}
                  breeds={breeds}
                />
              </div>
            )}
          </div>
        )}

        {/* Botões - SEMPRE NO FINAL */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 px-6 pb-6">
          <button
            type="button"
            className="btn-primary"
            onClick={async () => {
              try {
                if (showPetForm) {
                  // Se o formulário de pet está aberto, adiciona o pet atual à lista e limpa o formulário
                  const petForm = document.querySelector('form[data-pet-form]');
                  if (petForm) {
                    const formData = new FormData(petForm);
                    const petData = {
                      name: formData.get('name'),
                      species: formData.get('species'),
                      breed: formData.get('breed'),
                      color: formData.get('color'),
                      gender: formData.get('gender'),
                      birthdate: formData.get('birthdate'),
                      notes: formData.get('notes')
                    };
                    // Só adiciona se tiver pelo menos nome e espécie
                    if (petData.name && petData.species) {
                      handlePetFormSubmit(petData, { keepOpen: true });
                    } else {
                      // Se não tem dados válidos, apenas abre um novo formulário
                      setEditingPet(null);
                      setShowPetForm(true);
                      setPetFormResetKey(prev => prev + 1);
                    }
                  } else {
                    // Se não encontrar o formulário, apenas abre um novo
                    setEditingPet(null);
                    setShowPetForm(true);
                    setPetFormResetKey(prev => prev + 1);
                  }
                } else {
                  setEditingPet(null);
                  setShowPetForm(true);
                  setPetFormResetKey(prev => prev + 1);
                }
              } catch (error) {
                console.error('Erro ao adicionar pet:', error);
                // Em caso de erro, abre um novo formulário
                setEditingPet(null);
                setShowPetForm(true);
                setPetFormResetKey(prev => prev + 1);
              }
            }}
            disabled={loading}
          >
            Adicionar Pet
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn-primary flex items-center"
            disabled={loading}
            onClick={async () => {
              try {
                // Se o formulário de pet está aberto e preenchido, adiciona o pet antes de cadastrar
                if (showPetForm) {
                  const petForm = document.querySelector('form[data-pet-form]');
                  if (petForm) {
                    const formData = new FormData(petForm);
                    const petData = {
                      name: formData.get('name'),
                      species: formData.get('species'),
                      breed: formData.get('breed'),
                      color: formData.get('color'),
                      gender: formData.get('gender'),
                      birthdate: formData.get('birthdate'),
                      notes: formData.get('notes')
                    };
                    // Só adiciona se tiver pelo menos nome e espécie
                    if (petData.name && petData.species) {
                      handlePetFormSubmit(petData, { keepOpen: false });
                    }
                  }
                }
                
                // Agora salva o cliente e todos os pets
                const clientForm = document.getElementById('client-form');
                if (clientForm) {
                  clientForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                } else {
                  // Fallback: chama diretamente o handleFormSubmit
                  const form = document.querySelector('form');
                  if (form) {
                    const formData = new FormData(form);
                    const clientData = {
                      name: formData.get('name'),
                      phone: formData.get('phone'),
                      cpf: formData.get('cpf'),
                      address: {
                        street: formData.get('street'),
                        number: formData.get('number'),
                        neighborhood: formData.get('neighborhood'),
                        city: formData.get('city'),
                        state: formData.get('state'),
                        cep: formData.get('cep')
                      }
                    };
                    handleFormSubmit(clientData);
                  }
                }
              } catch (error) {
                console.error('Erro ao cadastrar:', error);
              }
            }}
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {client ? 'Atualizar' : 'Cadastrar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientForm; 