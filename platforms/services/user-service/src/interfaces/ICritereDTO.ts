/**
 * Interface de crit�res pour un model
 * @Author ModelGenerator - 2025-03-23T13:06:22.086Z - Cr�ation
 */
export class ICritereDTO {
  id?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}
