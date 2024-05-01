import React from 'react';
import type { ROLES } from 'src/types/user';
import useAuthStore from 'src/store/auth';

const WithRole = (
  WrappedComponent: React.ComponentType,
  allowedRoles: (typeof ROLES)[number][]
) => {
  const RoleBasedComponent: React.FC = (props) => {
    const { user } = useAuthStore();

    if (user && allowedRoles.includes(user.role)) {
      return <WrappedComponent {...props} />;
    } else {
      return <div>Not authorized</div>;
    }
  };

  return <RoleBasedComponent />;
};

export default WithRole;
