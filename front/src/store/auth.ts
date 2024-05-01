import { create } from 'zustand';
import { type JwtPayload, jwtDecode } from 'jwt-decode';
import { UserType, UserReadType } from 'src/types/user';
import { getUser, removeUser, setUser } from 'src/utils/auth';
import { logout, refreshToken, signIn } from 'src/api/endpoints/auth';
import { getById } from 'src/api/endpoints/user';

type AuthStore = {
  user: UserReadType | null;
  getProfile: (id: string) => Promise<UserReadType>;
  login: (data: Pick<UserType, 'email' | 'password'>) => Promise<unknown | null>;
  refresh: () => Promise<{ accessToken: string; refreshToken: string }>;
  logout: () => Promise<void>;
};

const useAuthStore = create<AuthStore>((set, get) => ({
  user: getUser(),
  getProfile: (id) => {
    return getById(id);
  },
  login: async (data) => {
    try {
      const response = await signIn(data);

      const decodedToken = jwtDecode(response.data.accessToken) as JwtPayload & { id: string };

      const profile = await get().getProfile(decodedToken.id);

      set({ user: profile });
      setUser(profile);

      return null;
    } catch (error) {
      return error;
    }
  },
  refresh: async () => {
    const tokens = await refreshToken();
    return tokens;
  },
  logout: async () => {
    removeUser();
    set({ user: null });
    await logout();
  },
}));

export default useAuthStore;
