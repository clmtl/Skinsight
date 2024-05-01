import PageTitle from 'src/components/PageTitle';
import ConsultationRow from 'src/components/ConsultationRow';
import { Flex } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import { findManyByPatient } from 'src/api/endpoints/consultations';
import useAuthStore from 'src/store/auth';

const Requests = () => {
  const { user } = useAuthStore();

  const { data } = useQuery({
    queryKey: ['consultations'],
    queryFn: () => findManyByPatient(user?.id.toString() as string),
  });

  const futureConsultations = data?.filter(
    (consultation) => new Date(consultation.appointment.appointment_time) > new Date()
  );

  const orderedFutureConsultations = futureConsultations?.sort(
    (a, b) =>
      new Date(a.appointment.appointment_time).getTime() -
      new Date(b.appointment.appointment_time).getTime()
  );

  const pastConsultations = data?.filter(
    (consultation) => new Date(consultation.appointment.appointment_time) < new Date()
  );

  const orderedPastConsultations = pastConsultations?.sort(
    (a, b) =>
      new Date(b.appointment.appointment_time).getTime() -
      new Date(a.appointment.appointment_time).getTime()
  );

  return (
    <>
      <PageTitle type="h2" title="Consultations à venir" />
      <Flex direction="column" gap="4" align="center" mb="6">
        {orderedFutureConsultations?.map((consultation) => (
          <ConsultationRow
            key={consultation.id}
            title={`${consultation.doctor.last_name} ${consultation.doctor.first_name}`}
            date={consultation.appointment.appointment_time}
            button
            id={consultation.id}
            disabled
            notes={consultation.notes}
          />
        ))}
      </Flex>
      <PageTitle type="h2" title="Consultations passées" />
      <Flex direction="column" gap="4" align="center">
        {!pastConsultations?.length ? (
          <p>Aucune consultation passée</p>
        ) : (
          orderedPastConsultations?.map((consultation) => (
            <ConsultationRow
              key={consultation.id}
              title={`${consultation.doctor.last_name} ${consultation.doctor.first_name}`}
              date={consultation.appointment.appointment_time}
              button
              id={consultation.id}
              notes={consultation.notes}
            />
          ))
        )}
      </Flex>
    </>
  );
};

export default Requests;
