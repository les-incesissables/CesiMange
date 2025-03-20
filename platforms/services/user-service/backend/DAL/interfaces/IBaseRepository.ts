import { BaseCritereDTO } from "../../models/base/BaseCritereDTO";
import { BaseDTO } from "../../models/base/BaseDTO";

/**
 * Contrôleur de base générique
 * @template DTO - Type de données retourné/manipulé
 * @template CritereDTO - Type des critères de recherche
 */
export interface IBaseRepository<DTO extends BaseDTO, CritereDTO extends BaseCritereDTO>
{
    /**
     * Obtenir tous les éléments selon des critères
     * @param pCritereDTO - Critères de recherche
     */
    getItems(pCritereDTO: CritereDTO): Promise<DTO[]>;

    /**
     * Obtenir un élément par critères
     * @param pCritereDTO - Critères identifiant l'élément
     */
    getItem(pCritereDTO: CritereDTO): Promise<DTO>;

    /**
     * Créer un nouvel élément
     * @param pDTO - Données pour la création
     */
    createItem(pDTO: DTO): Promise<DTO>;

    /**
     * Mettre à jour un élément existant
     * @param pDTO - Données pour la mise à jour
     * @param pCritereDTO - Critères identifiant l'élément à mettre à jour
     */
    updateItem(pDTO: DTO, pCritereDTO: CritereDTO): Promise<DTO>;

    /**
     * Supprimer un élément
     * @param pCritereDTO - Critères pour la suppression
     */
    deleteItem(pCritereDTO: CritereDTO): Promise<boolean>;

    /**
     * Vérifier si un élément existe selon des critères
     * @param pCritereDTO - Critères de recherche
     */
    itemExists(pCritereDTO: CritereDTO): Promise<boolean>;
}