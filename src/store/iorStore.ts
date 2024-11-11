import { create } from 'zustand';
import { IORMaterial } from '../types/ior';
import { materialsApi } from '../api/materials';

interface IORStore {
  materials: IORMaterial[];
  isAdmin: boolean;
  adminPassword: string;
  isLoading: boolean;
  error: string | null;
  setAdmin: (status: boolean) => void;
  fetchMaterials: () => Promise<void>;
  addMaterial: (material: Omit<IORMaterial, 'id'>) => Promise<void>;
  updateMaterial: (id: string, material: Partial<IORMaterial>) => Promise<void>;
  deleteMaterial: (id: string) => Promise<void>;
  validatePassword: (password: string) => boolean;
}

const ADMIN_PASSWORD = 'admin123'; // In production, use a secure password and proper authentication

export const useIORStore = create<IORStore>((set, get) => ({
  materials: [],
  isAdmin: false,
  adminPassword: ADMIN_PASSWORD,
  isLoading: false,
  error: null,
  setAdmin: (status) => set({ isAdmin: status }),
  
  fetchMaterials: async () => {
    set({ isLoading: true, error: null });
    try {
      const materials = await materialsApi.getAll();
      set({ materials, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch materials', isLoading: false });
    }
  },

  addMaterial: async (material) => {
    set({ isLoading: true, error: null });
    try {
      const newMaterial = await materialsApi.create(material);
      set((state) => ({
        materials: [...state.materials, newMaterial],
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to add material', isLoading: false });
    }
  },

  updateMaterial: async (id, material) => {
    set({ isLoading: true, error: null });
    try {
      const updatedMaterial = await materialsApi.update(id, material);
      set((state) => ({
        materials: state.materials.map((m) =>
          m.id === id ? updatedMaterial : m
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to update material', isLoading: false });
    }
  },

  deleteMaterial: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await materialsApi.delete(id);
      set((state) => ({
        materials: state.materials.filter((m) => m.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to delete material', isLoading: false });
    }
  },

  validatePassword: (password) => password === ADMIN_PASSWORD,
}));