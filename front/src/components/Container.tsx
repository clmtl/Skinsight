import { Container } from '@radix-ui/themes';

const ContainerLayout = ({ children }: { children: React.JSX.Element }) => {
  return (
    <Container size="4" my="9" position="relative">
      {children}
    </Container>
  );
};

export default ContainerLayout;
