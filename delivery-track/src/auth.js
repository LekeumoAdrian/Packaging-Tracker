// auth.js
export const getToken = () => {
    return localStorage.getItem('token');
  };

  export const setToken = (token) => {
    localStorage.setItem('token', token);
  };

  export const getUserRole = () => {
    return localStorage.getItem('role');
  };

  export const setUserRole = (role) => {
    localStorage.setItem('role', role);
  };

  export const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };
