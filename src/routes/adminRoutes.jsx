import { Navigate } from 'react-router-dom';
import Layout from '../components/dashboard/Layout';
import DashboardHome from '../components/pages/DashboardHome';
import Vehicles from '../components/pages/Vehicles';
import VehicleDetails from '../components/vehicles/VehicleDetails';
import Bookings from '../components/pages/Bookings';
import BookingDetails from '../components/bookings/BookingDetails';
import Customers from '../components/pages/Customers';
import CustomerDetails from '../components/customers/CustomerDetails';
import Reports from '../components/pages/Reports';
import Settings from '../components/pages/Settings';

const adminRoutes = [
  {
    path: '/admin',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <DashboardHome />
      },
      {
        path: 'vehicles',
        element: <Vehicles />
      },
      {
        path: 'vehicles/:id',
        element: <VehicleDetails />
      },
      {
        path: 'bookings',
        element: <Bookings />
      },
      {
        path: 'bookings/:id',
        element: <BookingDetails />
      },
      {
        path: 'customers',
        element: <Customers />
      },
      {
        path: 'customers/:id',
        element: <CustomerDetails />
      },
      {
        path: 'reports',
        element: <Reports />
      },
      {
        path: 'settings',
        element: <Settings />
      },
      {
        path: '*',
        element: <Navigate to="/admin" replace />
      }
    ]
  }
];

export default adminRoutes;