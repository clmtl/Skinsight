import axios from 'axios';
import { AppointmentReadType } from 'src/types/appointment';

export function createAppointment(data: FormData) {
  return axios.post('/appointments', data).then((res) => res.data);
}

export function findManyByDoctor(id: string): Promise<AppointmentReadType[]> {
  return axios.get(`/appointments/doctor/${id}`).then((res) => res.data);
}

export function findManyByPatient(id: string) {
  return axios.get(`/appointments/patient/${id}`).then((res) => res.data);
}
