/**
 * Contr�leur de base g�n�rique
 * @template DTO - Type de donn�es retourn�/manipul�
 * @template CritereDTO - Type des crit�res de recherche
 */
export interface IBaseRepository<DTO, CritereDTO>
{
    /**
     * Obtenir tous les �l�ments selon des crit�res
     * @param pCritereDTO - Crit�res de recherche
     */
    getItems(pCritereDTO: CritereDTO): Promise<DTO[]>;

    /**
     * Obtenir un �l�ment par crit�res
     * @param pCritereDTO - Crit�res identifiant l'�l�ment
     */
    getItem(pCritereDTO: CritereDTO): Promise<DTO>;

    /**
     * Cr�er un nouvel �l�ment
     * @param pDTO - Donn�es pour la cr�ation
     */
    createItem(pDTO: DTO): Promise<DTO>;

    /**
     * Mettre � jour un �l�ment existant
     * @param pDTO - Donn�es pour la mise � jour
     * @param pCritereDTO - Crit�res identifiant l'�l�ment � mettre � jour
     */
    updateItem(pDTO: DTO, pCritereDTO: CritereDTO): Promise<DTO>;

    /**
     * Supprimer un �l�ment
     * @param pCritereDTO - Crit�res pour la suppression
     */
    deleteItem(pCritereDTO: CritereDTO): Promise<boolean>;

    /**
     * V�rifier si un �l�ment existe selon des crit�res
     * @param pCritereDTO - Crit�res de recherche
     */
    itemExists(pCritereDTO: CritereDTO): Promise<boolean>;

    initialize(): Promise<void>;
}