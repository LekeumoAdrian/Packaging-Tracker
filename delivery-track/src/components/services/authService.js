import axios from 'axios';
import api from '../../api';


const axiosInstance = axios.create({
  baseURL: `${api}`,
  headers: {
    'Content-Type': 'application/json',
  },
});
const authService = {

  login: async (data) => {
    const response = await axiosInstance.post(`${api}/auth/login`, data);
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },

  register: async (data) => {
    const response = await axiosInstance.post(`${api}/auth/register`, data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  }
};

export default authService;