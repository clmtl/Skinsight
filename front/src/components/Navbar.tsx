import { Button, Section, Flex, IconButton, AlertDialog } from '@radix-ui/themes';
import { ExitIcon } from '@radix-ui/react-icons';
import { Link, useLocation } from 'react-router-dom';
import useAuthStore from 'src/store/auth';
import Dialog from './AlertDialog';

const Navbar = () => {
  const location = useLocation();
  const { user } = useAuthStore();

  const choices = [
    { title: 'Mes patients', path: '/patients', roles: ['doctor', 'dermatologist'] },
    { title: 'Spécialistes', path: '/specialistes', roles: ['doctor', 'dermatologist'] },
    { title: 'Mes consultations', path: '/consultations', roles: ['patient'] },
    { title: 'Mon drive', path: '/drive', roles: ['patient'] },
  ];

  return (
    <Section size="1" className={`${location.pathname !== '/' && 'rounded-b-3xl'}`} px="9">
      <Flex align="center" justify="between">
        <Button variant="ghost" className="text-sky-600 font-bold hover:bg-inherit">
          <Link to="/">SKINSIGHT</Link>
        </Button>
        <Flex gap="6" align="center">
          {choices.map((choice, index) => {
            if (user && choice.roles.includes(user.role)) {
              return (
                <Button variant={location.pathname === choice.path ? 'solid' : 'ghost'} key={index}>
                  <Link to={choice.path}>{choice.title}</Link>
                </Button>
              );
            }
          })}
        </Flex>
        {user ? (
          <Flex gap="1">
            <Button variant={location.pathname === '/profil' ? 'solid' : 'surface'}>
              <Link to="/profil">Mon compte</Link>
            </Button>
            <AlertDialog.Root>
              <AlertDialog.Trigger>
                <IconButton>
                  <ExitIcon />
                </IconButton>
              </AlertDialog.Trigger>
              <Dialog />
            </AlertDialog.Root>
          </Flex>
        ) : (
          <Button variant="surface">
            <Link to="/auth/login">Se connecter</Link>
          </Button>
        )}
      </Flex>
    </Section>
  );
};

export default Navbar;
