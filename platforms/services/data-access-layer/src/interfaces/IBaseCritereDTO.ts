/**
 * Interface de base pour les crit�res de recherche
 * @author Mahmoud Charif - CESIMANGE-118 - 17/03/2025 - Adaptation aux normes
 */
export interface IBaseCritereDTO
{
    //#region Properties

    /**
     * Identifiant unique de l'�l�ment recherch�
     */
    id?: number;

    /**
     * Liste d'identifiants pour recherche multiple
     */
    ids?: string[];

    /**
     * Terme de recherche textuelle
     */
    search?: string;

    /**
     * Num�ro de la page courante (pour pagination)
     */
    page?: number;

    /**
     * Nombre d'�l�ments par page (pour pagination)
     */
    pageSize?: number;

    /**
     * Champ utilis� pour le tri
     */
    sort?: string;

    /**
     * Direction du tri (ascendant ou descendant)
     */
    sortDirection?: 'asc' | 'desc';

    /**
     * Indique si les �l�ments supprim�s doivent �tre inclus
     */
    hasNext?: boolean;

    /**
     * Nombre maximum d'�l�ments � retourner
     */
    limit?: number;

    /**
     * Nombre d'�l�ments � sauter (pour pagination)
     */
    skip?: number; 

    populate?: string[];

    //#endregion
}