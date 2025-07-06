import { useState, useEffect } from 'react';
import ServiceTypeService from '../services/serviceTypeService';

export const useServiceTypes = () => {
  const [serviceTypes, setServiceTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServiceTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ServiceTypeService.getAll();
      setServiceTypes(response.data);
    } catch (err) {
      console.error('Erro ao buscar tipos de serviço:', err);
      setError('Erro ao carregar tipos de serviço');
    } finally {
      setLoading(false);
    }
  };

  const createServiceType = async (serviceTypeData) => {
    try {
      const response = await ServiceTypeService.create(serviceTypeData);
      setServiceTypes(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error('Erro ao criar tipo de serviço:', err);
      throw err;
    }
  };

  const updateServiceType = async (id, serviceTypeData) => {
    try {
      const response = await ServiceTypeService.update(id, serviceTypeData);
      setServiceTypes(prev => 
        prev.map(st => st.id === id ? response.data : st)
      );
      return response.data;
    } catch (err) {
      console.error('Erro ao atualizar tipo de serviço:', err);
      throw err;
    }
  };

  const deleteServiceType = async (id) => {
    try {
      await ServiceTypeService.delete(id);
      setServiceTypes(prev => prev.filter(st => st.id !== id));
    } catch (err) {
      console.error('Erro ao deletar tipo de serviço:', err);
      throw err;
    }
  };

  const searchServiceTypes = async (query) => {
    try {
      const response = await ServiceTypeService.search(query);
      return response.data;
    } catch (err) {
      console.error('Erro ao buscar tipos de serviço:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchServiceTypes();
  }, []);

  return {
    serviceTypes,
    loading,
    error,
    fetchServiceTypes,
    createServiceType,
    updateServiceType,
    deleteServiceType,
    searchServiceTypes
  };
}; 