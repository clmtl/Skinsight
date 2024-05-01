import axios from 'axios';
import { FindManyUsersResponseType, UserReadType } from 'src/types/user';

export function getById(id: string) {
  return axios.get<UserReadType>(`/users/${id}`).then((res) => res.data);
}

export function findMany() {
  return axios.get<FindManyUsersResponseType>('/users').then((res) => res.data);
}
