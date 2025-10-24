import { Navigate } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/Layout';
import DashboardHome from '../components/pages/DashboardHome';
import Vehicles from '../components/pages/Vehicles';
import VehicleDetails from '../components/vehicles/VehicleDetails';
import Bookings from '../components/pages/Bookings';
import BookingDetails from '../components/pages/BookingDetails';
import Customers from '../components/pages/Customers';
import CustomerDetails from '../components/pages/CustomerDetails';
import Reports from '../components/pages/Reports';
import Settings from '../components/pages/Settings';
import Login from '../components/pages/Login';
import VehicleForm from '../components/vehicles/VehicleForm';
import BookingForm from '../components/bookings/BookingForm';
import CustomerForm from '../components/customers/CustomerForm';

const routes = [
  // Auth routes
  {
    path: '/login',
    element: <Login />,
    public: true
  },
  
  // Dashboard routes
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <DashboardHome />
      },
      
      // Vehicle routes
      {
        path: 'vehicles',
        children: [
          {
            index: true,
            element: <Vehicles />
          },
          {
            path: ':id',
            element: <VehicleDetails />
          },
          {
            path: 'add',
            element: <VehicleForm isNew={true} />
          },
          {
            path: ':id/edit',
            element: <VehicleForm isEditing={true} />
          }
        ]
      },
      
      // Booking routes
      {
        path: 'bookings',
        children: [
          {
            index: true,
            element: <Bookings />
          },
          {
            path: ':id',
            element: <BookingDetails />
          },
          {
            path: 'new',
            element: <BookingForm isNew={true} />
          },
          {
            path: ':id/edit',
            element: <BookingForm isEditing={true} />
          }
        ]
      },
      
      // Customer routes
      {
        path: 'customers',
        children: [
          {
            index: true,
            element: <Customers />
          },
          {
            path: ':id',
            element: <CustomerDetails />
          },
          {
            path: 'new',
            element: <CustomerForm isNew={true} />
          },
          {
            path: ':id/edit',
            element: <CustomerForm isEditing={true} />
          }
        ]
      },
      
      // Reports route
      {
        path: 'reports',
        element: <Reports />
      },
      
      // Settings route
      {
        path: 'settings',
        element: <Settings />
      },
      
      // Fallback route
      {
        path: '*',
        element: <Navigate to="/dashboard" replace />
      }
    ]
  }
];

export default routes;