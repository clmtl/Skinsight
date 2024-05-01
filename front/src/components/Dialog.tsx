import { Button, Dialog, Flex, Text } from '@radix-ui/themes';
import { findOne } from 'src/api/endpoints/skinImages';
import { useQuery } from '@tanstack/react-query';

const CustomModal = ({
  consultationId,
  title,
  date,
  notes,
}: {
  consultationId: number;
  title: string;
  date: string;
  notes?: string;
}) => {
  const { data } = useQuery({
    queryKey: ['skin-images'],
    queryFn: () => findOne(consultationId.toString()),
  });

  const diagnosticColor = data?.ai_analysis?.analysis_result_good ? 'red' : 'green';
  const diagnosticResult = data?.ai_analysis?.analysis_result_good ? 'Positif' : 'Négatif';

  return (
    <Dialog.Content style={{ maxWidth: 450 }}>
      <Flex direction="column" align="center">
        <Dialog.Title as="h2">Préconsultation du {date}</Dialog.Title>
        <Dialog.Title as="h3" color="gray" weight="light" size="3">
          Dr {title}
        </Dialog.Title>
      </Flex>
      <Dialog.Description size="2" my="4">
        {notes ?? 'Aucune note pour cette consultation'}
      </Dialog.Description>

      <Text weight="bold">
        Diagnostic: <span style={{ color: diagnosticColor }}>{diagnosticResult}</span>
      </Text>
      <Flex gap="3" mt="4" justify="center">
        <Dialog.Close>
          <Button style={{ width: '50%' }} variant="soft" color="gray">
            Fermer
          </Button>
        </Dialog.Close>{' '}
        <Dialog.Close>
          <Button style={{ width: '50%' }}>Prendre rendez-vous</Button>
        </Dialog.Close>
      </Flex>
    </Dialog.Content>
  );
};

export default CustomModal;
