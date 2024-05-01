import axios from 'axios';
import { ConsultationReadType } from 'src/types/consultation';

export function findManyByPatient(id: string): Promise<ConsultationReadType[]> {
  return axios.get(`/consultations/patient/${id}`).then((res) => res.data);
}

export function findManyByDoctor(id: string): Promise<ConsultationReadType[]> {
  return axios.get(`/consultations/doctor/${id}`).then((res) => res.data);
}
