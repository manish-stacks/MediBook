// src/store/auth.store.ts
import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import api from '../api/client';

export type UserRole = 'PATIENT' | 'DOCTOR' | 'SUPER_ADMIN' | 'CLINIC_ADMIN';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  loadFromStorage: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  loadFromStorage: async () => {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      const userStr = await SecureStore.getItemAsync('user');
      if (token && userStr) {
        const user = JSON.parse(userStr);
        set({ user, isAuthenticated: true });
      }
    } catch {}
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const { user, accessToken, refreshToken } = data.data;
      await SecureStore.setItemAsync('accessToken', accessToken);
      await SecureStore.setItemAsync('refreshToken', refreshToken);
      await SecureStore.setItemAsync('user', JSON.stringify(user));
      set({ user, isAuthenticated: true, isLoading: false });
      return user;
    } catch (e: any) {
      set({ isLoading: false });
      throw new Error(e.response?.data?.message || 'Login failed');
    }
  },

  register: async (formData) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/auth/register', formData);
      const { user, accessToken, refreshToken } = data.data;
      await SecureStore.setItemAsync('accessToken', accessToken);
      await SecureStore.setItemAsync('refreshToken', refreshToken);
      await SecureStore.setItemAsync('user', JSON.stringify(user));
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (e: any) {
      set({ isLoading: false });
      throw new Error(e.response?.data?.message || 'Registration failed');
    }
  },

  logout: async () => {
    try { await api.post('/auth/logout'); } catch {}
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('user');
    set({ user: null, isAuthenticated: false });
  },

  updateUser: (data) => {
    const current = get().user;
    if (!current) return;
    const updated = { ...current, ...data };
    set({ user: updated });
    SecureStore.setItemAsync('user', JSON.stringify(updated));
  },
}));
