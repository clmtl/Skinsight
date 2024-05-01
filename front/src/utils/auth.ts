import { UserWithoutPasswordType } from 'src/types/user';

export const setUser = (user: UserWithoutPasswordType | null) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  if (user) return JSON.parse(user);
  return null;
};

export const removeUser = () => {
  localStorage.removeItem('user');
};
