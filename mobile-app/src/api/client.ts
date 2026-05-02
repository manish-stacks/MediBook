import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const API_BASE = 'https://api.medibook.adsdigitalmedia.com/api/v1';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const orig = error.config;
    if (error.response?.status === 401 && !orig._retry) {
      orig._retry = true;
      try {
        const refresh = await SecureStore.getItemAsync('refreshToken');
        if (!refresh) throw new Error('No refresh token');
        const { data } = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken: refresh });
        await SecureStore.setItemAsync('accessToken', data.data.accessToken);
        await SecureStore.setItemAsync('refreshToken', data.data.refreshToken);
        orig.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(orig);
      } catch {
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
      }
    }
    return Promise.reject(error);
  },
);

export default api;
