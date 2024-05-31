import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getToken, getUserRole } from './auth';
import authService from './components/services/authService';

const PrivateRoute = ({ children, role }) => {
    const token = getToken();
    const userRole = getUserRole();

    if (!token) {
      return <Navigate to="/login" />;
    }

    if (role && !role.includes(userRole)) {
      return <Navigate to="/login" />;
    }

    return children;

};

export default PrivateRoute;
