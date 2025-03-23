import { Navigate } from 'react-router-dom';
import Layout from '../components/dashboard/Layout';
import DashboardHome from '../pages/DashboardHome';
import Vehicles from '../pages/Vehicles';
import VehicleDetails from '../pages/VehicleDetails';
import Bookings from '../pages/Bookings';
import BookingDetails from '../pages/BookingDetails';
import Customers from '../pages/Customers';
import CustomerDetails from '../pages/CustomerDetails';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';

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