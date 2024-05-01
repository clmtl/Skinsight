import './index.css';
import '@radix-ui/themes/styles.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import axios from 'axios';
import { refreshToken } from './api/endpoints/auth';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { getById } from './api/endpoints/user';
import { setUser } from './utils/auth';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;
axios.defaults.timeout = 8000;

axios.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status !== 401) return Promise.reject(error);

    if (error.response.status === 401) {
      try {
        const tokens = await refreshToken();
        if (!tokens) {
          window.location.href = '/auth/login';
          return Promise.reject(error);
        }

        const decodedToken = jwtDecode(tokens.accessToken) as JwtPayload & { id: string };
        const user = await getById(decodedToken.id);
        setUser(user);
        return;
      } catch (error) {
        window.location.href = '/auth/login';
        return Promise.reject(error);
      }
    }
  }
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
