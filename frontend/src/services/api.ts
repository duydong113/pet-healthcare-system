import axios from '@/lib/axios';

// Auth APIs
export const authAPI = {
  loginStaff: (data: { email: string; password: string }) =>
    axios.post('/auth/login/staff', data),
  loginOwner: (data: { email: string; password: string }) =>
    axios.post('/auth/login/owner', data),
};

// Pet Owner APIs
export const petOwnerAPI = {
  getAll: () => axios.get('/pet-owners'),
  getOne: (id: number) => axios.get(`/pet-owners/${id}`),
  create: (data: any) => axios.post('/pet-owners', data),
  update: (id: number, data: any) => axios.patch(`/pet-owners/${id}`, data),
  delete: (id: number) => axios.delete(`/pet-owners/${id}`),
};

// Pet APIs
export const petAPI = {
  getAll: () => axios.get('/pets'),
  getOne: (id: number) => axios.get(`/pets/${id}`),
  create: (data: any) => axios.post('/pets', data),
  update: (id: number, data: any) => axios.patch(`/pets/${id}`, data),
  delete: (id: number) => axios.delete(`/pets/${id}`),
};

// Service APIs
export const serviceAPI = {
  getAll: () => axios.get('/services'),
  getOne: (id: number) => axios.get(`/services/${id}`),
  create: (data: any) => axios.post('/services', data),
  update: (id: number, data: any) => axios.patch(`/services/${id}`, data),
  delete: (id: number) => axios.delete(`/services/${id}`),
};

// Staff APIs
export const staffAPI = {
  getAll: () => axios.get('/staff'),
  getOne: (id: number) => axios.get(`/staff/${id}`),
  create: (data: any) => axios.post('/staff', data),
  update: (id: number, data: any) => axios.patch(`/staff/${id}`, data),
  delete: (id: number) => axios.delete(`/staff/${id}`),
};

// Appointment APIs
export const appointmentAPI = {
  getAll: () => axios.get('/appointments'),
  getOne: (id: number) => axios.get(`/appointments/${id}`),
  create: (data: any) => axios.post('/appointments', data),
  update: (id: number, data: any) => axios.patch(`/appointments/${id}`, data),
  delete: (id: number) => axios.delete(`/appointments/${id}`),
};

// Medical Record APIs
export const medicalRecordAPI = {
  getAll: () => axios.get('/medical-records'),
  getOne: (id: number) => axios.get(`/medical-records/${id}`),
  create: (data: any) => axios.post('/medical-records', data),
  update: (id: number, data: any) => axios.patch(`/medical-records/${id}`, data),
  delete: (id: number) => axios.delete(`/medical-records/${id}`),
};

// Invoice APIs
export const invoiceAPI = {
  getAll: () => axios.get('/invoices'),
  getOne: (id: number) => axios.get(`/invoices/${id}`),
  create: (data: any) => axios.post('/invoices', data),
  update: (id: number, data: any) => axios.patch(`/invoices/${id}`, data),
  delete: (id: number) => axios.delete(`/invoices/${id}`),
};