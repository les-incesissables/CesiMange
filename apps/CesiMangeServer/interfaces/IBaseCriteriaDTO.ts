/**
 * Interface de base pour les critères de recherche
 */
export interface IBaseCriteriaDTO
{
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    filters?: Record<string, any>;
}