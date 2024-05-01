import { User } from 'src/users/entities/user.entity';

export type RequestType = {
  user: User;
  cookies: {
    Authorization: string;
    Refresh: string;
  };
};
