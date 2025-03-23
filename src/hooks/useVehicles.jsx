import { useState, useEffect } from 'react';
import { db } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function useVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  
  // Fetch all vehicles
  const fetchVehicles = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await db.cars.getAll();
      
      if (error) {
        throw error;
      }
      
      setVehicles(data || []);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError(err.message || 'Failed to fetch vehicles');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get available vehicles
  const fetchAvailableVehicles = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await db.cars.getAvailable();
      
      if (error) {
        throw error;
      }
      
      setVehicles(data || []);
    } catch (err) {
      console.error('Error fetching available vehicles:', err);
      setError(err.message || 'Failed to fetch available vehicles');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get vehicle by ID
  const getVehicle = async (id) => {
    if (!isAuthenticated || !id) return null;
    
    try {
      const { data, error } = await db.cars.getById(id);
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (err) {
      console.error(`Error fetching vehicle with ID ${id}:`, err);
      setError(err.message || `Failed to fetch vehicle with ID ${id}`);
      return null;
    }
  };
  
  // Create new vehicle
  const createVehicle = async (vehicleData) => {
    if (!isAuthenticated) return null;
    
    try {
      const { data, error } = await db.cars.create(vehicleData);
      
      if (error) {
        throw error;
      }
      
      // Refresh the vehicles list
      fetchVehicles();
      
      return data;
    } catch (err) {
      console.error('Error creating vehicle:', err);
      setError(err.message || 'Failed to create vehicle');
      return null;
    }
  };
  
  // Update vehicle
  const updateVehicle = async (id, vehicleData) => {
    if (!isAuthenticated || !id) return null;
    
    try {
      const { data, error } = await db.cars.update(id, vehicleData);
      
      if (error) {
        throw error;
      }
      
      // Refresh the vehicles list
      fetchVehicles();
      
      return data;
    } catch (err) {
      console.error(`Error updating vehicle with ID ${id}:`, err);
      setError(err.message || `Failed to update vehicle with ID ${id}`);
      return null;
    }
  };
  
  // Delete vehicle
  const deleteVehicle = async (id) => {
    if (!isAuthenticated || !id) return false;
    
    try {
      const { error } = await db.cars.delete(id);
      
      if (error) {
        throw error;
      }
      
      // Refresh the vehicles list
      fetchVehicles();
      
      return true;
    } catch (err) {
      console.error(`Error deleting vehicle with ID ${id}:`, err);
      setError(err.message || `Failed to delete vehicle with ID ${id}`);
      return false;
    }
  };
  
  // Fetch vehicles on mount and when auth status changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchVehicles();
    }
  }, [isAuthenticated]);
  
  return {
    vehicles,
    isLoading,
    error,
    fetchVehicles,
    fetchAvailableVehicles,
    getVehicle,
    createVehicle,
    updateVehicle,
    deleteVehicle
  };
}