import { Navigate } from 'react-router-dom';
import AuthLayout from 'src/layouts/AuthLayout';
import useAuthStore from 'src/store/auth';

export default function ProtectedMiddleware() {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/auth/login" />;

  return <AuthLayout />;
}
