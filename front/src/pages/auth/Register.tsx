import { useEffect, useState } from 'react';
import { Container, Flex, Card, TextField, Button, Heading, Select } from '@radix-ui/themes';
import { useMutation } from '@tanstack/react-query';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Toast from 'src/components/Toast';
import { register } from 'src/api/endpoints/auth';

import { UserType, GENDERS, ROLES } from 'src/types/user';
import { errorMessages } from 'src/utils/errorMessages';
import { patterns } from 'src/utils/patterns';

const Register = () => {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const registerUser = useMutation({
    mutationFn: register,
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      role: 'patient' as (typeof ROLES)[number],
      first_name: '',
      gender: 'male' as (typeof GENDERS)[number],
      last_name: '',
      phone_number: '',
      birth_date: '',
      doctor_adeli: '',
    },
  });

  const onSubmit: SubmitHandler<Omit<UserType, 'role'>> = (data) => {
    const formattedData = { ...data, birth_date: new Date(data.birth_date).toISOString() };

    registerUser.mutate(formattedData);
  };

  useEffect(() => {
    if (registerUser.isSuccess) {
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
        navigate('/auth/login');
      }, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerUser.isSuccess]);

  const role = watch('role');

  return (
    <>
      <Toast open={open} type="success">
        Compte créé avec succès
      </Toast>

      <Container className="flex-row items-center justify-center" size="2">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card style={{ height: '40rem' }}>
            <Flex justify="center" align="center" height="100%">
              <Flex direction="column" gap="9" className="w-1/2">
                <Heading as="h1" align="center">
                  Inscription
                </Heading>
                <Flex direction="column" gap="4">
                  <Flex gap="4" className="[&>*]:grow">
                    <Flex direction="column">
                      <Controller
                        name="last_name"
                        control={control}
                        rules={{
                          required: errorMessages.required_last_name,
                          pattern: {
                            value: patterns.last_name,
                            message: errorMessages.last_name_pattern,
                          },
                        }}
                        render={({ field }) => <TextField.Input placeholder="Nom" {...field} />}
                      />
                      {errors.last_name && (
                        <span className="text-red-500 text-xs">{errors.last_name.message}</span>
                      )}
                    </Flex>
                    <Flex direction="column">
                      <Controller
                        name="first_name"
                        control={control}
                        rules={{
                          required: errorMessages.required_first_name,
                          pattern: {
                            value: patterns.first_name,
                            message: errorMessages.first_name_pattern,
                          },
                        }}
                        render={({ field }) => <TextField.Input placeholder="Prénom" {...field} />}
                      />
                      {errors.first_name && (
                        <span className="text-red-500 text-xs">{errors.first_name.message}</span>
                      )}
                    </Flex>
                  </Flex>
                  <Flex>
                    <Flex direction="column">
                      <Controller
                        name="email"
                        control={control}
                        rules={{
                          required: errorMessages.required_email,
                          pattern: { value: patterns.email, message: errorMessages.email_pattern },
                        }}
                        render={({ field }) => <TextField.Input placeholder="Email" {...field} />}
                      />
                      {errors.email && (
                        <span className="text-red-500 text-xs">{errors.email.message}</span>
                      )}
                    </Flex>
                  </Flex>
                  <Flex gap="4" className="[&>*]:grow">
                    <Flex direction="column">
                      <Controller
                        name="birth_date"
                        control={control}
                        rules={{ required: errorMessages.required_birth_date }}
                        render={({ field }) => (
                          <input
                            style={{ borderWidth: '1px', borderRadius: '4px', paddingLeft: '12px' }}
                            className="border-slate-300"
                            placeholder="Date de naissance"
                            type="date"
                            {...field}
                          />
                        )}
                      />
                      {errors.birth_date && (
                        <span className="text-red-500 text-xs">{errors.birth_date.message}</span>
                      )}
                    </Flex>
                    <Controller
                      name="gender"
                      control={control}
                      rules={{ required: errorMessages.required_gender }}
                      render={({ field }) => (
                        <Select.Root value={field.value} onValueChange={field.onChange}>
                          <Select.Trigger aria-label="Sexe" />
                          <Select.Content>
                            <Select.Group>
                              <Select.Label>Sexe</Select.Label>
                              <Select.Item value="male">Homme</Select.Item>
                              <Select.Item value="female">Femme</Select.Item>
                            </Select.Group>
                          </Select.Content>
                        </Select.Root>
                      )}
                    />
                  </Flex>
                  <Controller
                    name="role"
                    control={control}
                    rules={{ required: errorMessages.required_role }}
                    render={({ field }) => (
                      <Select.Root value={field.value} onValueChange={field.onChange}>
                        <Select.Trigger />
                        <Select.Content>
                          <Select.Group>
                            <Select.Label>Role</Select.Label>
                            <Select.Item value="patient">Patient</Select.Item>
                            <Select.Item value="doctor">Docteur</Select.Item>
                            <Select.Item value="dermatologist">Dermatologue</Select.Item>
                          </Select.Group>
                        </Select.Content>
                      </Select.Root>
                    )}
                  />

                  {role !== 'patient' && (
                    <Flex direction="column">
                      <Controller
                        name="doctor_adeli"
                        control={control}
                        rules={{
                          required: errorMessages.required_doctor_adeli,
                          pattern: {
                            value: patterns.doctor_adeli,
                            message: errorMessages.doctor_adeli_pattern,
                          },
                        }}
                        render={({ field }) => (
                          <TextField.Input placeholder="Numéro ADELI" {...field} />
                        )}
                      />
                      {errors.doctor_adeli && (
                        <span className="text-red-500 text-xs">{errors.doctor_adeli.message}</span>
                      )}
                    </Flex>
                  )}
                  <Flex gap="4" className="[&>*]:grow">
                    <Flex direction="column">
                      <Controller
                        name="phone_number"
                        control={control}
                        rules={{
                          required: errorMessages.required_phone_number,
                          minLength: {
                            value: 10,
                            message: errorMessages.phone_number_length,
                          },
                          maxLength: {
                            value: 10,
                            message: errorMessages.phone_number_length,
                          },
                          pattern: {
                            value: patterns.phone,
                            message: errorMessages.phone_number_pattern,
                          },
                        }}
                        render={({ field }) => (
                          <TextField.Input placeholder="Numéro de téléphone" {...field} />
                        )}
                      />
                      {errors.phone_number && (
                        <span className="text-red-500 text-xs">{errors.phone_number.message}</span>
                      )}
                    </Flex>
                  </Flex>
                  <Flex direction="column">
                    <Controller
                      name="password"
                      control={control}
                      rules={{
                        required: errorMessages.required_password,
                        minLength: { value: 8, message: errorMessages.password_length },
                        pattern: {
                          value: patterns.password,
                          message: errorMessages.password_pattern,
                        },
                      }}
                      render={({ field }) => (
                        <TextField.Input type="password" placeholder="Mot de passe" {...field} />
                      )}
                    />
                    {errors.password && (
                      <span className="text-red-500 text-xs">{errors.password.message}</span>
                    )}
                  </Flex>
                </Flex>
                <Flex direction="column" gap="1">
                  <Button type="submit">S'inscrire</Button>
                  <Link to="/auth/login" className="text-xs">
                    Vous avez déjà un compte ? Se connecter
                  </Link>
                </Flex>
              </Flex>
            </Flex>
          </Card>
        </form>
      </Container>
    </>
  );
};

export default Register;
