import { Navigate } from 'react-router-dom';
import Layout from '../components/dashboard/Layout';
import Vehicles from '../pages/Vehicles';
import VehicleDetails from '../pages/VehicleDetails';

const vehicleRoutes = [
  {
    path: '/vehicles',
    element: <Layout />,
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
        element: <VehicleDetails isNew={true} />
      },
      {
        path: ':id/edit',
        element: <VehicleDetails isEditing={true} />
      },
      {
        path: '*',
        element: <Navigate to="/vehicles" replace />
      }
    ]
  }
];

export default vehicleRoutes;