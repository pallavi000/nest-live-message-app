import axios from 'axios';

export const baseURL = 'http://localhost:3000/api';

const axiosInstance = axios.create({
  baseURL: baseURL,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${JSON.parse(accessToken)}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
export default axiosInstance;
