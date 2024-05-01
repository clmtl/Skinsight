import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import protectedRoutes from './protected.routes';
import guestRoutes from './guest.routes';
import GuestMiddleware from 'src/middleware/guest';
import ProtectedMiddleware from 'src/middleware/protected';
import { useMemo } from 'react';

const RouteProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useMemo(
    () =>
      createBrowserRouter([
        {
          element: children, // All the providers
          children: [
            { element: <GuestMiddleware />, children: guestRoutes },
            { element: <ProtectedMiddleware />, children: protectedRoutes },
          ],
        },
      ]),
    [children]
  );
  return <RouterProvider router={router} />;
};

export default RouteProvider;
