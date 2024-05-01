import { Box } from '@radix-ui/themes';
import { Outlet } from 'react-router-dom';
import ContainerLayout from 'src/components/Container';
import Footer from 'src/components/Footer';
import Navbar from 'src/components/Navbar';

const AuthLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <Box style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box style={{ flex: 1 }}>
        {children ?? (
          <ContainerLayout>
            <Outlet />
          </ContainerLayout>
        )}
      </Box>
      <Footer />
    </Box>
  );
};

export default AuthLayout;
