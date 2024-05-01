import { Box, Flex, Text } from '@radix-ui/themes';

const DocItem = ({ date, image }: { date: string; image: string }) => {
  return (
    <Flex direction="column" align="center" gap="2">
      <Box className="w-36 h-48">
        <img
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
            borderRadius: 'var(--radius-2)',
          }}
          src={image}
          alt="image de consultation"
        />
      </Box>
      <Text>{new Date(date).toLocaleDateString()}</Text>
    </Flex>
  );
};

export default DocItem;
