import { RouteObject } from 'react-router-dom';
import Login from 'src/pages/auth/Login';
import Register from 'src/pages/auth/Register';

const guestRoutes: RouteObject[] = [
  {
    path: '/auth/login',
    element: <Login />,
  },
  {
    path: '/auth/register',
    element: <Register />,
  },
];

export default guestRoutes;
