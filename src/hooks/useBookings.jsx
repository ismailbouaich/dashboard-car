import { useState, useEffect } from 'react';
import { db } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function useBookings() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated, isAdmin } = useAuth();
  
  // Fetch all bookings (admin only) or user bookings
  const fetchBookings = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      let data, error;
      
      // If admin, fetch all bookings, otherwise fetch only user's bookings
      if (isAdmin()) {
        ({ data, error } = await db.bookings.getAll());
      } else {
        ({ data, error } = await db.bookings.getByUser(user.id));
      }
      
      if (error) {
        throw error;
      }
      
      setBookings(data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.message || 'Failed to fetch bookings');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get booking by ID
  const getBooking = async (id) => {
    if (!isAuthenticated || !id) return null;
    
    try {
      const { data, error } = await db.bookings.getById(id);
      
      if (error) {
        throw error;
      }
      
      // If not admin, ensure user can only see their own bookings
      if (!isAdmin() && data.user_id !== user.id) {
        throw new Error('Unauthorized access to booking');
      }
      
      return data;
    } catch (err) {
      console.error(`Error fetching booking with ID ${id}:`, err);
      setError(err.message || `Failed to fetch booking with ID ${id}`);
      return null;
    }
  };
  
  // Create new booking
  const createBooking = async (bookingData) => {
    if (!isAuthenticated) return null;
    
    try {
      // Set user_id if not provided
      if (!bookingData.user_id) {
        bookingData.user_id = user.id;
      }
      
      // Calculate total amount if not provided
      if (!bookingData.total_amount && bookingData.car_id && bookingData.start_date && bookingData.end_date) {
        // Fetch car daily rate
        const { data: car } = await db.cars.getById(bookingData.car_id);
        
        if (car) {
          const startDate = new Date(bookingData.start_date);
          const endDate = new Date(bookingData.end_date);
          const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
          
          bookingData.total_amount = car.daily_rate * days;
        }
      }
      
      const { data, error } = await db.bookings.create(bookingData);
      
      if (error) {
        throw error;
      }
      
      // Update car availability
      await db.cars.update(bookingData.car_id, { is_available: false });
      
      // Refresh the bookings list
      fetchBookings();
      
      return data;
    } catch (err) {
      console.error('Error creating booking:', err);
      setError(err.message || 'Failed to create booking');
      return null;
    }
  };
  
  // Update booking
  const updateBooking = async (id, bookingData) => {
    if (!isAuthenticated || !id) return null;
    
    try {
      // Check if user has permission
      if (!isAdmin()) {
        const { data: existingBooking } = await db.bookings.getById(id);
        
        if (existingBooking && existingBooking.user_id !== user.id) {
          throw new Error('Unauthorized to update this booking');
        }
      }
      
      const { data, error } = await db.bookings.update(id, bookingData);
      
      if (error) {
        throw error;
      }
      
      // If updating status to 'completed' or 'cancelled', update car availability
      if (bookingData.status === 'completed' || bookingData.status === 'cancelled') {
        const { data: booking } = await db.bookings.getById(id);
        if (booking) {
          await db.cars.update(booking.car_id, { is_available: true });
        }
      }
      
      // Refresh the bookings list
      fetchBookings();
      
      return data;
    } catch (err) {
      console.error(`Error updating booking with ID ${id}:`, err);
      setError(err.message || `Failed to update booking with ID ${id}`);
      return null;
    }
  };
  
  // Delete booking (admin only)
  const deleteBooking = async (id) => {
    if (!isAuthenticated || !id) return false;
    
    try {
      // Only admin can delete bookings
      if (!isAdmin()) {
        throw new Error('Unauthorized to delete bookings');
      }
      
      // Get booking details to update car availability
      const { data: booking } = await db.bookings.getById(id);
      
      const { error } = await db.bookings.delete(id);
      
      if (error) {
        throw error;
      }
      
      // Update car availability if booking was active
      if (booking && (booking.status !== 'completed' && booking.status !== 'cancelled')) {
        await db.cars.update(booking.car_id, { is_available: true });
      }
      
      // Refresh the bookings list
      fetchBookings();
      
      return true;
    } catch (err) {
      console.error(`Error deleting booking with ID ${id}:`, err);
      setError(err.message || `Failed to delete booking with ID ${id}`);
      return false;
    }
  };
  
  // Fetch bookings on mount and when auth status changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);
  
  return {
    bookings,
    isLoading,
    error,
    fetchBookings,
    getBooking,
    createBooking,
    updateBooking,
    deleteBooking
  };
}