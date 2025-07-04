import { useState, useEffect, useCallback } from 'react';
import PetService from '../services/petService';

export const usePets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [species, setSpecies] = useState([]);
  const [breeds, setBreeds] = useState([]);

  // Carregar todos os pets
  const loadPets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await PetService.getAll();
      setPets(response.data?.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar estatísticas
  const loadStats = useCallback(async () => {
    try {
      const response = await PetService.getStats();
      setStats(response.data?.data);
    } catch (err) {
      // Apenas log
    }
  }, []);

  // Carregar espécies
  const loadSpecies = useCallback(async () => {
    try {
      const response = await PetService.getSpecies();
      setSpecies(response.data?.data || []);
    } catch (err) {}
  }, []);

  // Carregar raças
  const loadBreeds = useCallback(async () => {
    try {
      const response = await PetService.getBreeds();
      setBreeds(response.data?.data || []);
    } catch (err) {}
  }, []);

  // Criar pet
  const createPet = useCallback(async (petData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await PetService.create(petData);
      setPets(prev => [...prev, response.data.data]);
      await loadStats();
      return response.data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadStats]);

  // Atualizar pet
  const updatePet = useCallback(async (id, petData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await PetService.update(id, petData);
      setPets(prev => prev.map(pet => pet.id === id ? response.data.data : pet));
      return response.data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Deletar pet
  const deletePet = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await PetService.delete(id);
      setPets(prev => prev.filter(pet => pet.id !== id));
      await loadStats();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadStats]);

  // Buscar pets
  const searchPets = useCallback(async (query) => {
    if (!query.trim()) {
      await loadPets();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await PetService.search(query);
      setPets(response.data?.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [loadPets]);

  // Carregar dados iniciais
  useEffect(() => {
    loadPets();
    loadStats();
    loadSpecies();
    loadBreeds();
  }, [loadPets, loadStats, loadSpecies, loadBreeds]);

  return {
    pets,
    loading,
    error,
    stats,
    species,
    breeds,
    loadPets,
    createPet,
    updatePet,
    deletePet,
    searchPets,
    loadStats,
    loadSpecies,
    loadBreeds
  };
}; 