import PageTitle from 'src/components/PageTitle';
// import HistoryRow from 'src/components/ConsultationRow';
import { Flex } from '@radix-ui/themes';
// import useAuthStore from 'src/store/auth';

const Patients = () => {
  // const { user } = useAuthStore();

  return (
    <>
      <PageTitle title="Patients" />
      <Flex direction="column" gap="4" align="center">
        {/* <HistoryRow title="Dr John DOE" icon={user?.role === 'dermatologist'} button />
        <HistoryRow title="Dr John DOE" icon={user?.role === 'dermatologist'} />
        <HistoryRow title="Dr John DOE" icon={user?.role === 'dermatologist'} />
        <HistoryRow title="Dr John DOE" icon={user?.role === 'dermatologist'} /> */}
      </Flex>
    </>
  );
};

export default Patients;
