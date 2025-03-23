import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { LoginForm } from '@/components/login-form';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const Login = () => {
  const { isAuthenticated, login, loading } = useAuth();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      setIsLoggingIn(true);
      await login(email, password);
      toast.success("Login successful!");
      navigate('/admin');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || "Please check your credentials and try again");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-screen sm:w-200 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">RideHaven</h1>
          <p className="text-muted-foreground">Car Rental Management System</p>
        </div>
        
        <LoginForm onSubmit={handleLogin} isLoading={isLoggingIn || loading} />
      </div>
    </div>
  );
};

export default Login;