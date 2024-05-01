import { Flex, Text } from '@radix-ui/themes';

const InfosItem = ({ title, subtitle }: { title: string; subtitle: string }) => {
  return (
    <Flex direction="column">
      <Text>{title}</Text>
      <Text weight="light" color="gray">
        {subtitle}
      </Text>
    </Flex>
  );
};

export default InfosItem;
