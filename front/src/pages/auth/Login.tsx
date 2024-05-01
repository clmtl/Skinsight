import { useState } from 'react';
import { Container, Flex, Card, TextField, Button, Heading } from '@radix-ui/themes';

import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { Link } from 'react-router-dom';
import useAuthStore from 'src/store/auth';
import { UserType } from 'src/types/user';
import { errorMessages } from 'src/utils/errorMessages';
import Toast from 'src/components/Toast';

const Login = () => {
  const [open, setOpen] = useState(false);
  const { login } = useAuthStore();

  const onSubmit: SubmitHandler<Pick<UserType, 'email' | 'password'>> = async (data) => {
    const response = await login(data);

    // Response is null if login successful
    if (response) {
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 2000);
    }
  };

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <>
      <Toast open={open} type="error">
        {errorMessages.invalid_credentials}
      </Toast>
      <Container className="flex-row items-center justify-center" size="2">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card style={{ height: '40rem' }}>
            <Flex justify="center" align="center" height="100%">
              <Flex direction="column" gap="9" className="w-1/2">
                <Heading align="center" as="h1">
                  Connexion
                </Heading>
                <Flex direction="column" gap="4">
                  <Controller
                    name="email"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => <TextField.Input placeholder="Email" {...field} />}
                  />
                  <Controller
                    name="password"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField.Input type="password" placeholder="Mot de passe" {...field} />
                    )}
                  />
                </Flex>
                <Flex direction="column" gap="1">
                  <Button type="submit">Se connecter</Button>
                  <Link to="/auth/register" className="text-xs">
                    Vous n'avez pas encore de compte ? S'inscrire
                  </Link>
                </Flex>
              </Flex>
            </Flex>
          </Card>
        </form>
      </Container>
    </>
  );
};

export default Login;
