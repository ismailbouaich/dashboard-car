import { Navigate } from 'react-router-dom';
import Layout from '../components/dashboard/Layout';
import Bookings from '../components/pages/Bookings';
import BookingDetails from '../components/bookings/BookingDetails';

const bookingRoutes = [
  {
    path: '/bookings',
    element: <Layout />,
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
        element: <BookingDetails isNew={true} />
      },
      {
        path: ':id/edit',
        element: <BookingDetails isEditing={true} />
      },
      {
        path: '*',
        element: <Navigate to="/bookings" replace />
      }
    ]
  }
];

export default bookingRoutes;