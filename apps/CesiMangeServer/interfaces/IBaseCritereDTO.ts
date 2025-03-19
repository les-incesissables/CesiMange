/**
 * Interface de base pour les critères de recherche
 * @author Mahmoud Charif - CESIMANGE-118 - 17/03/2025 - Adaptation aux normes
 */
export interface IBaseCritereDTO
{
    //#region Properties

    /**
     * Identifiant unique de l'élément recherché
     */
    Id?: string;

    /**
     * Liste d'identifiants pour recherche multiple
     */
    Ids?: string[];

    /**
     * Terme de recherche textuelle
     */
    Search?: string;

    /**
     * Numéro de la page courante (pour pagination)
     */
    Page?: number;

    /**
     * Nombre d'éléments par page (pour pagination)
     */
    PageSize?: number;

    /**
     * Champ utilisé pour le tri
     */
    Sort?: string;

    /**
     * Direction du tri (ascendant ou descendant)
     */
    SortDirection?: 'asc' | 'desc';

    /**
     * Indique si les éléments supprimés doivent être inclus
     */
    IncludeDeleted?: boolean;

    /**
     * Nombre maximum d'éléments à retourner
     */
    Limit: number;

    /**
     * Nombre d'éléments à sauter (pour pagination)
     */
    Skip?: number; 

    //#endregion
}