// src/api/endpoints.ts
import api from './client';

// ── Auth ──
export const authApi = {
  login:          (email: string, password: string) => api.post('/auth/login', { email, password }),
  register:       (data: any) => api.post('/auth/register', data),
  refresh:        (refreshToken: string) => api.post('/auth/refresh', { refreshToken }),
  logout:         () => api.post('/auth/logout'),
  profile:        () => api.get('/auth/profile'),
  changePassword: (data: any) => api.post('/auth/change-password', data),
};

// ── Doctors ──
export const doctorsApi = {
  list:        (params?: any) => api.get('/doctors', { params }),
  getById:     (id: string) => api.get(`/doctors/${id}`),
  getStats:    () => api.get('/doctors/me/stats'),
  getToday:    () => api.get('/doctors/me/today'),
  getEarnings: () => api.get('/doctors/me/earnings'),
  updateProfile: (data: any) => api.put('/doctors/me', data),
};

// ── Appointments ──
export const appointmentsApi = {
  list:         (params?: any) => api.get('/appointments', { params }),
  getById:      (id: string) => api.get(`/appointments/${id}`),
  create:       (data: any) => api.post('/appointments', data),
  updateStatus: (id: string, data: any) => api.put(`/appointments/${id}/status`, data),
  reschedule:   (id: string, data: any) => api.put(`/appointments/${id}/reschedule`, data),
  getStats:     () => api.get('/appointments/stats'),
};

// ── Slots ──
export const slotsApi = {
  getMySlots:       () => api.get('/slots/my-slots'),
  create:           (data: any) => api.post('/slots', data),
  delete:           (id: string) => api.delete(`/slots/${id}`),
  getAvailable:     (doctorId: string, date: string) => api.get(`/slots/doctor/${doctorId}/available?date=${date}`),
  getAvailableDates:(doctorId: string) => api.get(`/slots/doctor/${doctorId}/dates`),
};

// ── Patients ──
export const patientsApi = {
  list:      () => api.get('/patients'),
  create:    (data: any) => api.post('/patients', data),
  update:    (id: string, data: any) => api.put(`/patients/${id}`, data),
  delete:    (id: string) => api.delete(`/patients/${id}`),
  addVitals: (patientId: string, data: any) => api.post(`/patients/${patientId}/vitals`, data),
  history:   (patientId: string) => api.get(`/patients/${patientId}/history`),
};

// ── Prescriptions ──
export const prescriptionsApi = {
  create:        (data: any) => api.post('/prescriptions', data),
  update:        (id: string, data: any) => api.put(`/prescriptions/${id}`, data),
  getById:       (id: string) => api.get(`/prescriptions/${id}`),
  getByApt:      (aptId: string) => api.get(`/prescriptions/appointment/${aptId}`),
  pdfUrl:        (id: string) => `${require('./client').API_BASE}/prescriptions/${id}/pdf`,
};

// ── Payments ──
export const paymentsApi = {
  history:      () => api.get('/payments/history'),
  createOrder:  (aptId: string) => api.post(`/payments/create-order/${aptId}`),
  verify:       (data: any) => api.post('/payments/verify', data),
};

// ── Notifications ──
export const notificationsApi = {
  list:      () => api.get('/notifications'),
  readAll:   () => api.put('/notifications/read-all'),
  readOne:   (id: string) => api.put(`/notifications/${id}/read`),
};

// ── Specialities ──
export const specialitiesApi = {
  list: () => api.get('/specialities'),
};

// ── Favorites ──
export const favoritesApi = {
  list:   () => api.get('/favorites'),
  toggle: (doctorId: string) => api.post(`/favorites/toggle/${doctorId}`),
  check:  (doctorId: string) => api.get(`/favorites/check/${doctorId}`),
};

// ── Users ──
export const usersApi = {
  getProfile:    () => api.get('/users/me'),
  updateProfile: (data: any) => api.put('/users/me', data),
};

// ── Reviews ──
export const reviewsApi = {
  create: (data: any) => api.post('/reviews', data),
};
