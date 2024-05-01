import { Flex, Text } from '@radix-ui/themes';

const Footer = () => {
  return (
    <Flex
      align="center"
      style={{
        backgroundColor: '#1A1A1A',
        height: '20rem',
        justifyContent: 'space-around',
        width: '100%',
      }}
    >
      <img src="src/assets/images/logo.png" alt="logo" />
      <Text style={{ color: 'white' }}>Copyright © 2023 | SkinSight | Mentions légales</Text>
    </Flex>
  );
};

export default Footer;
