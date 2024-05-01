import { Flex, Container, Text, Button, Grid, Dialog } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import Balancer from 'react-wrap-balancer';
import { findMany } from 'src/api/endpoints/user';
import Preconsult from 'src/components/Preconsult';
import useAuthStore from 'src/store/auth';

const Home = () => {
  const { user } = useAuthStore();

  const { data, refetch, isError, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: findMany,
    enabled: false,
  });

  isLoading && <Text>Loading...</Text>;
  isError && <Text>Error fetching users</Text>;

  return (
    <Flex direction="column" gap="2">
      <Flex
        className="h-96 rounded-b-3xl"
        align="center"
        direction="column"
        style={{ backgroundColor: '#68A9DC', width: '100vw', top: '-64px' }}
        position="absolute"
        left="0"
      >
        <Container>
          <Flex wrap="wrap">
            <Flex className="w-6/12" align="center">
              <Balancer ratio={0}>
                <Text className="text-white" size="4">
                  Bienvenue sur SkinSight, votre allié dans la prévention et la détection précoces
                  du cancer de la peau. Notre puissante intelligence artificielle est à votre
                  service pour évaluer les risques potentiels en analysant vos photos de peau.
                </Text>
              </Balancer>
            </Flex>
            <Flex className="w-6/12" m="auto" justify="center">
              <img
                src="/src/assets/svg/medical.svg"
                alt="Home medical image"
                className="w-96 h-96"
              />
            </Flex>
          </Flex>
        </Container>
        {user?.role === 'patient' && (
          <Dialog.Root>
            <Dialog.Trigger>
              <Button style={{ marginTop: '-1rem' }} onClick={() => refetch()}>
                Débuter une préconsultation
              </Button>
            </Dialog.Trigger>
            <Preconsult healthcarePractitioners={data} />
          </Dialog.Root>
        )}
      </Flex>
      <Grid columns="4" rows="2" style={{ marginTop: '23rem' }} gap="9">
        <Flex align="center">
          <Balancer ratio={0}>
            <Text size="3">
              <strong>Détectez tôt, vivez mieux</strong> SkinSight, l'IA pour un diagnostic précoce
              du cancer de la peau. Votre santé, notre mission.
            </Text>
          </Balancer>
        </Flex>
        <Flex align="center" justify="center">
          <img src="/src/assets/svg/medical1.svg" alt="Medical image" className="w-48 h-48" />
        </Flex>
        <Flex align="center" justify="center">
          <img src="/src/assets/svg/medical2.svg" alt="Medical image" className="w-48 h-48" />
        </Flex>
        <Flex align="center">
          <Balancer ratio={0}>
            <Text size="3">
              <strong>Précision à portée de main</strong> Analyse IA de vos photos pour une
              détection précise. Avec SkinSight, votre smartphone devient un outil de santé.
            </Text>
          </Balancer>
        </Flex>
        <Flex align="center">
          <Balancer ratio={0}>
            <Text size="3">
              <strong>Vers des soins spécialisés</strong> Risque détecté ? SkinSight vous oriente
              vers un dermatologue. La technologie au service de votre bien-être.
            </Text>
          </Balancer>
        </Flex>
        <Flex align="center" justify="center">
          <img src="/src/assets/svg/medical3.svg" alt="Medical image" className="w-48 h-48" />
        </Flex>
        <Flex align="center" justify="center">
          <img src="/src/assets/svg/medical4.svg" alt="Medical image" className="w-48 h-48" />
        </Flex>
        <Flex align="center">
          <Balancer ratio={0}>
            <Text size="3">
              <strong>Prévention numérique</strong> Embrassez la prévention du cancer de la peau
              avec SkinSight. La santé cutanée à l'ère de l'IA.
            </Text>
          </Balancer>
        </Flex>
      </Grid>
    </Flex>
  );
};

export default Home;
