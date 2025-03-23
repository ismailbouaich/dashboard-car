import { AppSidebar } from "@/components/app-sidebar"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import SearchForm from "@/components/searchForm"
import { useIsMobile } from '@/hooks/use-mobile';
import DashboardLayout from "./components/dashboard/Layout";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { DashboardProvider } from '@/context/DashboardContext';
import { Toaster } from "@/components/ui/sonner";
import Login from '@/components/pages/Login';
// Import route configurations
import adminRoutes from './routes/adminRoutes';
import vehicleRoutes from './routes/vehicleRoutes';
import bookingRoutes from './routes/bookingRoutes';
import customerRoutes from './routes/customerRoutes';
import reportRoutes from './routes/reportRoutes';
import CarLoading from "./components/CarLoading";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  // if (loading) {
  //   return <CarLoading/>;
  // }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// App component without authentication check
function AppContent() {
  const isMobile = useIsMobile();

  // Convert route config objects to Route components
  const renderRoutes = (routes) => {
    return routes.map((route) => {
      if (route.children) {
        return (
          <Route key={route.path} path={route.path} element={
            <ProtectedRoute>
              {route.element}
            </ProtectedRoute>
          }>
            {renderRoutes(route.children)}
          </Route>
        );
      }
      
      return (
        <Route 
          key={route.path || 'index'} 
          path={route.path} 
          index={route.index} 
          element={
            <ProtectedRoute>
              {route.element}
            </ProtectedRoute>
          } 
        />
      );
    });
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {renderRoutes(adminRoutes)}
        {/* {renderRoutes(vehicleRoutes)}
        {renderRoutes(bookingRoutes)}
        {renderRoutes(customerRoutes)}
        {renderRoutes(reportRoutes)} */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

// Main App function
export default function App() {
  return (
    <AuthProvider>
      <DashboardProvider>
        <AppContent />
      </DashboardProvider>
    </AuthProvider>
  );
}