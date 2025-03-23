import { Navigate } from 'react-router-dom';
import Layout from '../components/dashboard/Layout';
import Customers from '../components/pages/Customers';
import CustomerDetails from '../components/customers/CustomerDetails';

const customerRoutes = [
  {
    path: '/customers',
    element: <Layout />,
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
        element: <CustomerDetails isNew={true} />
      },
      {
        path: ':id/edit',
        element: <CustomerDetails isEditing={true} />
      },
      {
        path: '*',
        element: <Navigate to="/customers" replace />
      }
    ]
  }
];

export default customerRoutes;