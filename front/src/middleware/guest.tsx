import { Flex, Box } from '@radix-ui/themes';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from 'src/store/auth';

export default function GuestMiddleware() {
  const { user } = useAuthStore();

  if (user) return <Navigate to="/" />;

  return (
    <Flex direction="column" className="h-screen">
      <Box className="text-sky-600 font-bold pt-4 ml-10">SKINSIGHT</Box>
      <Outlet />
    </Flex>
  );
}
