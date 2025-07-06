import { useState, useEffect, useCallback } from 'react';
import AppointmentService from '../services/appointmentService';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await AppointmentService.getAll();
      setAppointments(response.data);
    } catch (err) {
      console.error('Erro ao buscar agendamentos:', err);
      setError('Erro ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAppointmentsByDate = useCallback(async (date) => {
    try {
      setLoading(true);
      setError(null);
      const response = await AppointmentService.getByDate(date);
      setAppointments(response.data);
    } catch (err) {
      console.error('Erro ao buscar agendamentos por data:', err);
      setError('Erro ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAppointmentsByClient = useCallback(async (clientId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await AppointmentService.getByClient(clientId);
      setAppointments(response.data);
    } catch (err) {
      console.error('Erro ao buscar agendamentos por cliente:', err);
      setError('Erro ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAppointmentsByPet = useCallback(async (petId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await AppointmentService.getByPet(petId);
      setAppointments(response.data);
    } catch (err) {
      console.error('Erro ao buscar agendamentos por pet:', err);
      setError('Erro ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await AppointmentService.getStats();
      setStats(response.data);
    } catch (err) {
      console.error('Erro ao buscar estatísticas:', err);
    }
  }, []);

  const createAppointment = useCallback(async (appointmentData) => {
    try {
      const response = await AppointmentService.create(appointmentData);
      setAppointments(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error('Erro ao criar agendamento:', err);
      throw err;
    }
  }, []);

  const updateAppointment = useCallback(async (id, appointmentData) => {
    try {
      const response = await AppointmentService.update(id, appointmentData);
      setAppointments(prev => 
        prev.map(apt => apt.id === id ? response.data : apt)
      );
      return response.data;
    } catch (err) {
      console.error('Erro ao atualizar agendamento:', err);
      throw err;
    }
  }, []);

  const updateAppointmentStatus = useCallback(async (id, status) => {
    try {
      const response = await AppointmentService.updateStatus(id, status);
      setAppointments(prev => 
        prev.map(apt => apt.id === id ? response.data : apt)
      );
      return response.data;
    } catch (err) {
      console.error('Erro ao atualizar status do agendamento:', err);
      throw err;
    }
  }, []);

  const deleteAppointment = useCallback(async (id) => {
    try {
      await AppointmentService.delete(id);
      setAppointments(prev => prev.filter(apt => apt.id !== id));
    } catch (err) {
      console.error('Erro ao deletar agendamento:', err);
      throw err;
    }
  }, []);

  const searchAppointments = useCallback(async (query) => {
    try {
      setLoading(true);
      setError(null);
      const response = await AppointmentService.search(query);
      setAppointments(response.data);
    } catch (err) {
      console.error('Erro ao buscar agendamentos:', err);
      setError('Erro ao buscar agendamentos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
    fetchStats();
  }, [fetchAppointments, fetchStats]);

  return {
    appointments,
    loading,
    error,
    stats,
    fetchAppointments,
    fetchAppointmentsByDate,
    fetchAppointmentsByClient,
    fetchAppointmentsByPet,
    fetchStats,
    createAppointment,
    updateAppointment,
    updateAppointmentStatus,
    deleteAppointment,
    searchAppointments
  };
}; 