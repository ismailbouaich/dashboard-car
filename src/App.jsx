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

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
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
        {renderRoutes(vehicleRoutes)}
        {renderRoutes(bookingRoutes)}
        {renderRoutes(customerRoutes)}
        {renderRoutes(reportRoutes)}
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

// Main App function
export default function App() {
  const isMobile = useIsMobile();

  return (
    <AuthProvider>
    <DashboardLayout>
      
      <header className="border-b border-border bg-background py-3 px-6">
      <div className="flex items-center justify-between">
          
      <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
        {/* Search bar */}
        
       
          <SearchForm  />
      
        
        {/* Mobile title */}
        {isMobile && (
          <h1 className="text-lg font-bold text-primary">RideHaven</h1>
        )}
        
        {/* Right side actions */}
        <div className="flex items-center space-x-4 ml-auto">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="Admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-background" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Admin User</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    admin@ridehaven.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <AppContent />
        </div>
     
    </DashboardLayout>
    </AuthProvider>
  )
}