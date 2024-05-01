import { Outlet } from 'react-router-dom';

import Providers from './providers';

export default function App() {
  return (
    <Providers>
      <Outlet />
    </Providers>
  );
}
