import { Navigate } from 'react-router-dom';
import Layout from '../components/dashboard/Layout';
import Reports from '../components/pages/Reports';
import RevenueReport from '../components/reports/RevenueReport';
import UtilizationReport from '../components/reports/UtilizationReport';
import BookingTrends from '../components/reports/BookingTrends';

const reportRoutes = [
  {
    path: '/reports',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Reports />
      },
      {
        path: 'revenue',
        element: <RevenueReport />
      },
      {
        path: 'utilization',
        element: <UtilizationReport />
      },
      {
        path: 'trends',
        element: <BookingTrends />
      },
      {
        path: '*',
        element: <Navigate to="/reports" replace />
      }
    ]
  }
];

export default reportRoutes;