import { AlertDialog, Button, Flex } from '@radix-ui/themes';
import useAuthStore from 'src/store/auth';

const Dialog = () => {
  const { logout } = useAuthStore();

  return (
    <AlertDialog.Content style={{ maxWidth: 450 }}>
      <AlertDialog.Title>Déconnexion</AlertDialog.Title>
      <AlertDialog.Description size="2">
        Êtes-vous sur de vouloir vous déconnecter ?
      </AlertDialog.Description>

      <Flex gap="3" mt="4" justify="end">
        <AlertDialog.Cancel>
          <Button variant="soft" color="gray">
            Non
          </Button>
        </AlertDialog.Cancel>
        <AlertDialog.Action>
          <Button variant="solid" color="red" onClick={() => logout()}>
            Oui
          </Button>
        </AlertDialog.Action>
      </Flex>
    </AlertDialog.Content>
  );
};

export default Dialog;
