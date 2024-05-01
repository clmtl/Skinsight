import { Box, Heading } from '@radix-ui/themes';

const PageTitle = ({
  title,
  type = 'h1',
}: {
  title: string;
  type?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | undefined;
}) => {
  return (
    <Box className="pb-10">
      <Heading as={type}>{title}</Heading>
    </Box>
  );
};

export default PageTitle;
