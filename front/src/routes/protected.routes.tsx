import { RouteObject } from 'react-router-dom';
import WithRole from './WithRole';
import Home from 'src/pages/home';
import Consultations from 'src/pages/consultations';
import Drive from 'src/pages/drive';
import Account from 'src/pages/account';
import Patients from 'src/pages/patients';
import Specialists from 'src/pages/specialists';

const protectedRoutes: RouteObject[] = [
  {
    path: '/',
    element: WithRole(Home, ['dermatologist', 'doctor', 'patient']),
  },
  {
    path: '/patients',
    element: WithRole(Patients, ['dermatologist', 'doctor']),
  },
  {
    path: '/specialistes',
    element: WithRole(Specialists, ['dermatologist', 'doctor']),
  },
  {
    path: '/consultations',
    element: WithRole(Consultations, ['patient']),
  },
  {
    path: '/drive',
    element: WithRole(Drive, ['patient']),
  },
  {
    path: '/profil',
    element: WithRole(Account, ['dermatologist', 'doctor', 'patient']),
  },
];

export default protectedRoutes;
