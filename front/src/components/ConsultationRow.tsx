import { Button, Dialog, Flex, Text } from '@radix-ui/themes';
import { EnvelopeClosedIcon } from '@radix-ui/react-icons';
import CustomDialog from './Dialog';

const HistoryRow = ({
  title,
  button,
  icon,
  date,
  id,
  disabled,
  notes,
}: {
  title: string;
  button?: boolean;
  icon?: boolean;
  date?: string;
  id: number;
  disabled?: boolean;
  notes?: string;
}) => {
  const formattedDate = date ? new Date(date).toLocaleDateString('fr-FR') : '';

  return (
    <Dialog.Root>
      <CustomDialog consultationId={id} title={title} date={formattedDate} notes={notes} />
      <Flex
        style={{
          backgroundColor: '#68A9DC',
          width: '56.0675rem',
          height: '3.2295rem',
          flexShrink: '0',
          borderRadius: '0.5rem',
        }}
        align="center"
        justify="between"
        px="4"
      >
        <Text weight="medium" className="text-white">
          {title}
        </Text>
        {date && (
          <Text className="text-white" weight="medium">
            {formattedDate}
          </Text>
        )}
        <Flex>
          {button && (
            <Dialog.Trigger>
              <Button disabled={disabled}>Voir le compte rendu</Button>
            </Dialog.Trigger>
          )}
          {icon && <EnvelopeClosedIcon color="white" onClick={() => console.log('coucou')} />}
        </Flex>
      </Flex>
    </Dialog.Root>
  );
};

export default HistoryRow;
