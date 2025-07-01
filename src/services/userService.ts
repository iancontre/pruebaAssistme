import api from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  // Agrega más campos según tu modelo
}

export const userService = {
  // Obtener todos los usuarios
  getUsers: async (): Promise<User[]> => {
    const response = await api.get('/db/users');
    return response.data;
  },

  // Obtener un usuario por ID
  getUserById: async (id: number): Promise<User> => {
    const response = await api.get(`/db/users/${id}`);
    return response.data;
  },

  // Crear un nuevo usuario
  createUser: async (userData: Omit<User, 'id'>): Promise<User> => {
    const response = await api.post('/db/users', userData);
    return response.data;
  },

  // Actualizar un usuario
  updateUser: async (id: number, userData: Partial<User>): Promise<User> => {
    const response = await api.put(`/db/users/${id}`, userData);
    return response.data;
  },

  // Eliminar un usuario
  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/db/users/${id}`);
  },

  // Petición al servicio de autenticación
  login: async (credentials: { username: string; password: string }) => {
    const response = await api.post('/oauth/auth/login', credentials);
    return response.data;
  },

  // Petición al servicio de email
  sendEmail: async (emailData: any) => {
    const response = await api.post('/email/send', emailData);
    return response.data;
  }
}; 