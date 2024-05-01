import { Button, Dialog, Flex, RadioGroup, Select, Separator, Text } from '@radix-ui/themes';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import Dropzone from './Dropzone';
import { FindManyUsersResponseType } from 'src/types/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createAppointment, findManyByDoctor } from 'src/api/endpoints/appointment';
import { useEffect, useState } from 'react';
import Toast from './Toast';

type Inputs = {
  date: string;
  time: string;
  doctor: string | undefined;
  image: File | null;
};

const NewConsultation = ({
  healthcarePractitioners,
}: {
  healthcarePractitioners: FindManyUsersResponseType | undefined;
}) => {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const createAppointmentCall = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  function transformTimeString(input: string) {
    const formattedHour = input.padStart(2, '0');

    return `${formattedHour}:00`;
  }

  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      date: '',
      time: '8',
      doctor: undefined,
      image: null,
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const appointmentTime = new Date(`${data.date}T${data.time}:00`).toISOString();
    const formData = new FormData();

    formData.append('appointment_time', appointmentTime);
    formData.append('doctor_id', data.doctor as string);
    formData.append('image', data.image as File);

    createAppointmentCall.mutate(formData);
  };

  const date = watch('date');
  const doctor = watch('doctor');

  const [doctorId, setDoctorId] = useState<string | undefined>(undefined);
  const [appointmentDate, setAppointmentDate] = useState<string>('');

  const { data } = useQuery({
    queryKey: ['appointments', 'doctors', doctorId, appointmentDate],
    queryFn: () => findManyByDoctor(doctorId as string),
    enabled: !!doctorId && !!appointmentDate,
  });

  const doctorTakenDates = data?.map(
    (appointment) => new Date(appointment.appointment_time).toISOString().split('T')[0]
  );

  const doctorTakenHours = data?.map((appointment) =>
    transformTimeString(new Date(appointment.appointment_time).getHours().toString())
  );

  const morningAppointmentHours = ['08:00', '09:00', '10:00', '11:00'];
  const afternoonAppointmentHours = ['14:00', '15:00', '16:00', '17:00'];

  useEffect(() => {
    if (createAppointmentCall.isSuccess) {
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
        reset();
      }, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createAppointmentCall.isSuccess]);

  return (
    <>
      <Toast open={open} type="success">
        Préconsultation réservée avec succès
      </Toast>
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Flex direction="column" align="center" mb="2">
          <Dialog.Title as="h2">Préconsultation avec généraliste</Dialog.Title>
        </Flex>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex justify="center" align="center" height="100%">
            <Flex direction="column" gap="4">
              <Flex direction="column" gap="1">
                <label htmlFor="date" className="font-semibold">
                  Date du rendez-vous
                </label>
                <Controller
                  name="date"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <input
                      type="date"
                      id="date"
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        setAppointmentDate(e.target.value);
                      }}
                    />
                  )}
                />
                <Separator my="3" size="4" />
              </Flex>
              {date && doctor && (
                <Flex direction="column" gap="1">
                  <label className="font-semibold">Heure du rendez-vous</label>
                  <Controller
                    name="time"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <RadioGroup.Root onValueChange={field.onChange} value={field.value}>
                        <Flex gap="9">
                          <Flex direction="column" gap="1">
                            {morningAppointmentHours.map((hour, index) => (
                              <Text as="label" size="2" key={index}>
                                <Flex gap="2">
                                  <RadioGroup.Item
                                    value={hour}
                                    disabled={
                                      doctorTakenDates?.includes(date) &&
                                      doctorTakenHours?.includes(hour)
                                    }
                                  />{' '}
                                  {hour}
                                </Flex>
                              </Text>
                            ))}
                          </Flex>
                          <Flex direction="column" gap="1">
                            {afternoonAppointmentHours.map((hour, index) => (
                              <Text as="label" size="2" key={index}>
                                <Flex gap="2">
                                  <RadioGroup.Item
                                    value={hour}
                                    disabled={
                                      doctorTakenDates?.includes(date) &&
                                      doctorTakenHours?.includes(hour)
                                    }
                                  />{' '}
                                  {hour}
                                </Flex>
                              </Text>
                            ))}
                          </Flex>
                        </Flex>
                      </RadioGroup.Root>
                    )}
                  />

                  <Separator my="3" size="4" />
                </Flex>
              )}
              <Flex direction="column" gap="1">
                <label htmlFor="doctor" className="font-semibold">
                  Médecin
                </label>
                {healthcarePractitioners?.doctors?.length ? (
                  <Controller
                    name="doctor"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select.Root
                        onValueChange={(value) => {
                          field.onChange(value);
                          setDoctorId(value);
                        }}
                        value={field.value}
                      >
                        <Select.Trigger />
                        <Select.Content>
                          <Select.Group>
                            {healthcarePractitioners?.doctors?.map((doctor) => (
                              <Select.Item key={doctor.id} value={doctor.id.toString()}>
                                {doctor.last_name} {doctor.first_name}
                              </Select.Item>
                            ))}
                          </Select.Group>
                        </Select.Content>
                      </Select.Root>
                    )}
                  />
                ) : (
                  'Aucun médecin disponible'
                )}
                <Separator my="3" size="4" />
              </Flex>
              <Flex direction="column" gap="1">
                <label className="font-semibold">Photo du grain de beauté</label>
                <Controller
                  name="image"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => <Dropzone onChange={field.onChange} value={field.value} />}
                />
              </Flex>
              <Flex gap="3" mt="4" justify="center">
                <Dialog.Close>
                  <Button variant="soft" color="gray" onClick={() => reset()}>
                    Fermer
                  </Button>
                </Dialog.Close>
                <Button type="submit">Prendre rendez-vous</Button>
              </Flex>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </>
  );
};

export default NewConsultation;
