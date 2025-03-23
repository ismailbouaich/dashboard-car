import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase, db } from '../lib/supabase';

// Create dashboard context
const DashboardContext = createContext(null);

// Custom hook to use the dashboard context
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export const DashboardProvider = ({ children }) => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [dashboardStats, setDashboardStats] = useState({
    totalVehicles: 0,
    availableVehicles: 0,
    activeBookings: 0,
    totalCustomers: 0,
    monthlyRevenue: 0,
    utilizationRate: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch dashboard stats from Supabase when user is authenticated
  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!isAuthenticated) return;
      
      setIsLoading(true);
      try {
        // Fetch total vehicles count
        const { data: cars, error: carsError } = await db.cars.getAll();
        if (carsError) throw carsError;
        
        // Fetch available vehicles count
        const { data: availableCars, error: availableCarsError } = await db.cars.getAvailable();
        if (availableCarsError) throw availableCarsError;
        
        // Fetch active bookings (where end_date is in the future)
        const { data: activeBookings, error: bookingsError } = await supabase
          .from('bookings')
          .select('*')
          .gte('end_date', new Date().toISOString())
          .not('status', 'eq', 'cancelled');
        if (bookingsError) throw bookingsError;
        
        // Fetch total customers (profiles)
        const { data: customers, error: customersError } = await db.profiles.getAll();
        if (customersError) throw customersError;
        
        // Calculate monthly revenue (bookings in the current month)
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        
        const { data: monthlyBookings, error: monthlyBookingsError } = await supabase
          .from('bookings')
          .select('total_amount')
          .gte('start_date', startOfMonth.toISOString());
        if (monthlyBookingsError) throw monthlyBookingsError;
        
        const monthlyRevenue = monthlyBookings.reduce((sum, booking) => sum + booking.total_amount, 0);
        
        // Calculate utilization rate (booked cars / total cars)
        const utilizationRate = cars.length > 0 
          ? ((cars.length - availableCars.length) / cars.length) * 100 
          : 0;
        
        setDashboardStats({
          totalVehicles: cars.length,
          availableVehicles: availableCars.length,
          activeBookings: activeBookings.length,
          totalCustomers: customers.length,
          monthlyRevenue,
          utilizationRate: Math.round(utilizationRate * 10) / 10
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isAuthenticated) {
      fetchDashboardStats();
    }
  }, [isAuthenticated]);
  
  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };
  
  // Change current view
  const changeView = (view) => {
    setCurrentView(view);
  };
  
  // Refresh dashboard stats
  const refreshStats = async () => {
    if (!isAuthenticated) return;
    
    // Re-run the same fetch logic as in the useEffect
    setIsLoading(true);
    try {
      // Fetch total vehicles count
      const { data: cars, error: carsError } = await db.cars.getAll();
      if (carsError) throw carsError;
      
      // Fetch available vehicles count
      const { data: availableCars, error: availableCarsError } = await db.cars.getAvailable();
      if (availableCarsError) throw availableCarsError;
      
      // Fetch active bookings (where end_date is in the future)
      const { data: activeBookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .gte('end_date', new Date().toISOString())
        .not('status', 'eq', 'cancelled');
      if (bookingsError) throw bookingsError;
      
      // Fetch total customers (profiles)
      const { data: customers, error: customersError } = await db.profiles.getAll();
      if (customersError) throw customersError;
      
      // Calculate monthly revenue (bookings in the current month)
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const { data: monthlyBookings, error: monthlyBookingsError } = await supabase
        .from('bookings')
        .select('total_amount')
        .gte('start_date', startOfMonth.toISOString());
      if (monthlyBookingsError) throw monthlyBookingsError;
      
      const monthlyRevenue = monthlyBookings.reduce((sum, booking) => sum + booking.total_amount, 0);
      
      // Calculate utilization rate (booked cars / total cars)
      const utilizationRate = cars.length > 0 
        ? ((cars.length - availableCars.length) / cars.length) * 100 
        : 0;
      
      setDashboardStats({
        totalVehicles: cars.length,
        availableVehicles: availableCars.length,
        activeBookings: activeBookings.length,
        totalCustomers: customers.length,
        monthlyRevenue,
        utilizationRate: Math.round(utilizationRate * 10) / 10
      });
    } catch (error) {
      console.error('Error refreshing dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Provide dashboard context value
  const value = {
    sidebarOpen,
    toggleSidebar,
    currentView,
    changeView,
    dashboardStats,
    refreshStats,
    isLoading
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};

export default DashboardContext;