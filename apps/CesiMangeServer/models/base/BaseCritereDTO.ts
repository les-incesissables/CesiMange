/**
 * Crit�res de base dont h�ritent tous les CritereDTOs
 */
export interface BaseCritereDTO {
  id?: string;
  ids?: string[];
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  sortDirection?: 'asc' | 'desc';
  includeDeleted?: boolean;
}
