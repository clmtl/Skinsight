import axios from 'axios';
import { UserType } from 'src/types/user';

export function register(body: Omit<UserType, 'role'>) {
  return axios.post<UserType>('/auth/sign-up', body).then((res) => res.data);
}

export async function signIn(body: Pick<UserType, 'email' | 'password'>) {
  return await axios.post<{ accessToken: string; refreshToken: string }>('/auth/sign-in', body);
}

export function refreshToken() {
  return axios
    .post<{ accessToken: string; refreshToken: string }>('/auth/refresh-token')
    .then((res) => res.data);
}

export function logout() {
  return axios.post('/auth/logout').then((res) => res.data);
}
