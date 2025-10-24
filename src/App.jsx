import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { DashboardProvider } from '@/context/DashboardContext';
import { Toaster } from "@/components/ui/sonner";
import CarLoading from "./components/CarLoading";
import routes from './routes/routes';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <CarLoading />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// App component without authentication check
function AppContent() {
  // Render routes based on the routes configuration
  const renderRoutes = (routes) => {
    return routes.map((route) => {
      // Handle public routes (like login)
      if (route.public) {
        return (
          <Route 
            key={route.path} 
            path={route.path} 
            element={route.element} 
          />
        );
      }
      
      // Handle routes with children
      if (route.children) {
        return (
          <Route 
            key={route.path} 
            path={route.path} 
            element={
              route.path === '/' || route.path === '' ? (
                <ProtectedRoute>
                  {route.element}
                </ProtectedRoute>
              ) : route.element
            }
          >
            {renderRoutes(route.children)}
          </Route>
        );
      }
      
      // Handle regular protected routes
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
        {renderRoutes(routes)}
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