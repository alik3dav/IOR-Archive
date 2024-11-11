export interface IORMaterial {
  id: string;
  name: string;
  category: string;
  iorValue: number;
  description?: string;
  wavelength?: number;
  temperature?: number;
  source?: string;
}