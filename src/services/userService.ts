import api from './api';

export interface User {
  id: number;
  name: string;
  email: string;
}

export const userService = {
  // Obtener todos los usuarios
  getUsers: async (): Promise<User[]> => {
    const response = await api.get('/usuarios');
    return response.data;
  },

  // Obtener un usuario por ID
  getUserById: async (id: number): Promise<User> => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  // Crear un nuevo usuario
  createUser: async (userData: Omit<User, 'id'>): Promise<User> => {
    const response = await api.post('/usuarios', userData);
    return response.data;
  },

  // Actualizar un usuario
  updateUser: async (id: number, userData: Partial<User>): Promise<User> => {
    const response = await api.put(`/usuarios/${id}`, userData);
    return response.data;
  },

  // Eliminar un usuario
  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/usuarios/${id}`);
  }
}; 