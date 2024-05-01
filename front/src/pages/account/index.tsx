import { Box, Flex } from '@radix-ui/themes';
import PageTitle from 'src/components/PageTitle';
import InfosItem from './components/InfosItem';
import DocItem from './components/DocItem';
import useAuthStore from 'src/store/auth';
import { useQuery } from '@tanstack/react-query';
import { findManyByUser } from 'src/api/endpoints/skinImages';

const Account = () => {
  const { user } = useAuthStore();
  const userAge = user?.birth_date
    ? new Date().getFullYear() - new Date(user?.birth_date).getFullYear()
    : '';
  const gender = user?.gender === 'male' ? 'Homme' : 'Femme';

  const { data, isSuccess } = useQuery({
    queryKey: ['skin-images', user?.id],
    queryFn: () => findManyByUser(user?.id.toString() as string),
  });

  if (!isSuccess) {
    return <div>Loading...</div>;
  }

  const allImages = (data?.good ?? []).concat(data?.bad ?? [], data?.notAnalyzed ?? []);

  return (
    <>
      <Box pb="9">
        <PageTitle title="Mes informations" type="h2" />
        <Flex gap="5">
          <InfosItem title="Nom" subtitle={user?.last_name || ''} />
          <InfosItem title="Prénom" subtitle={user?.first_name || ''} />
          <InfosItem title="Email" subtitle={user?.email || ''} />
          <InfosItem title="Téléphone" subtitle={user?.phone_number || ''} />
          <InfosItem title="Age" subtitle={userAge.toString() + ' ans'} />
          <InfosItem title="Sexe" subtitle={gender} />
        </Flex>
      </Box>
      <Box>
        <PageTitle title="Mes dernières images de consultation" type="h2" />
        <Flex gap="5">
          {isSuccess &&
            allImages?.map((image, index) => {
              return <DocItem key={index} date={image?.created_at} image={image?.image_path} />;
            })}
        </Flex>
      </Box>
    </>
  );
};

export default Account;
