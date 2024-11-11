import axios from 'axios';
import { IORMaterial } from '../types/ior';

const API_URL = 'http://localhost:3001';

export const materialsApi = {
  getAll: async () => {
    const response = await axios.get<IORMaterial[]>(`${API_URL}/materials`);
    return response.data;
  },

  create: async (material: Omit<IORMaterial, 'id'>) => {
    const response = await axios.post<IORMaterial>(`${API_URL}/materials`, material);
    return response.data;
  },

  update: async (id: string, material: Partial<IORMaterial>) => {
    const response = await axios.patch<IORMaterial>(`${API_URL}/materials/${id}`, material);
    return response.data;
  },

  delete: async (id: string) => {
    await axios.delete(`${API_URL}/materials/${id}`);
  }
};