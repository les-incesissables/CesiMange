import { IBaseRepository } from "../../DAL/interfaces/IBaseRepository";
import { Repository } from "../../DAL/repositories/Repository";
import { BaseCritereDTO } from "../../models/base/BaseCritereDTO";
import { BaseDTO } from "../../models/base/BaseDTO";
import { IBaseMetier } from "./IBaseMetier";

/**
 * Contrôleur de base générique
 * @template DTO - Type de données retourné/manipulé
 * @template CritereDTO - Type des critères de recherche
 */
export abstract class BaseMetier<DTO extends BaseDTO, CritereDTO extends BaseCritereDTO> implements IBaseMetier<DTO, CritereDTO>
{
    protected repository: IBaseRepository<DTO, CritereDTO>;

    constructor (pCollectionName : string)
    {
        const lRepo = new Repository<DTO, CritereDTO>(pCollectionName);
        this.repository = lRepo;
    }

    /**
     * Obtenir tous les éléments selon des critères 
     */
    async getItems(pCritereDTO: CritereDTO): Promise<DTO[]>
    {
        try
        {
            // Validation des critères si nécessaire
            this.validateCritereDTO(pCritereDTO);

            // Appliquer des règles métier avant la récupération
            this.beforeGetItems(pCritereDTO);

            // Déléguer la récupération au repository
            const items = await this.repository.getItems(pCritereDTO);

            // Appliquer des transformations ou règles après la récupération
            return items;
        } catch (error)
        {
            this.handleError(error, 'getItems');
            throw error;
        }
    }

    /**
     * Obtenir un élément par critères
     */
    async getItem(pCritereDTO: CritereDTO): Promise<DTO>
    {
        try
        {
            // Validation des critères
            this.validateCritereDTO(pCritereDTO);

            // Appliquer des règles métier avant la récupération
            this.beforeGetItem(pCritereDTO);

            // Déléguer la récupération au repository
            const item = await this.repository.getItem(pCritereDTO);

            return item;
        } catch (error)
        {
            this.handleError(error, 'getItem');
            throw error;
        }
    }

    /**
     * Créer un nouvel élément
     */
    async createItem(pDTO: DTO): Promise<DTO>
    {
        try
        {
            // Validation des données
            this.validateDTO(pDTO);

            // Appliquer des règles métier avant la création
            const preparedDTO = await this.beforeCreateItem(pDTO);

            // Déléguer la création au repository
            const item = await this.repository.createItem(preparedDTO);

            return item;
        } catch (error)
        {
            this.handleError(error, 'createItem');
            throw error;
        }
    }

    /**
     * Mettre à jour un élément existant
     */
    async updateItem(pDTO: DTO, pCritereDTO: CritereDTO): Promise<DTO>
    {
        try
        {
            // Validation des données et critères
            this.validateDTO(pDTO);
            this.validateCritereDTO(pCritereDTO);

            // Appliquer des règles métier avant la mise à jour
            const preparedDTO = await this.beforeUpdateItem(pDTO, pCritereDTO);

            // Déléguer la mise à jour au repository
            const item = await this.repository.updateItem(preparedDTO, pCritereDTO);

            return item;
        } catch (error)
        {
            this.handleError(error, 'updateItem');
            throw error;
        }
    }

    /**
     * Supprimer un élément
     */
    async deleteItem(pCritereDTO: CritereDTO): Promise<boolean>
    {
        try
        {
            // Validation des critères
            this.validateCritereDTO(pCritereDTO);

            // Appliquer des règles métier avant la suppression
            await this.beforeDeleteItem(pCritereDTO);

            // Déléguer la suppression au repository
            const result = await this.repository.deleteItem(pCritereDTO);

            return result;
        } catch (error)
        {
            this.handleError(error, 'deleteItem');
            throw error;
        }
    }

    /**
     * Vérifier si un élément existe selon des critères
     */
    async itemExists(pCritereDTO: CritereDTO): Promise<boolean>
    {
        try
        {
            // Validation des critères
            this.validateCritereDTO(pCritereDTO);

            // Déléguer la vérification au repository
            return await this.repository.itemExists(pCritereDTO);
        } catch (error)
        {
            this.handleError(error, 'itemExists');
            throw error;
        }
    }

    //#region Validation Errors

    /**
   * Valider les données avant création/mise à jour
   * À surcharger pour des validations spécifiques
   */
    protected validateDTO(pDTO: DTO): void
    {
        // Validation de base
        if (!pDTO)
        {
            throw new Error("Les données sont requises");
        }
    }

    /**
     * Valider les critères de recherche
     * À surcharger pour des validations spécifiques
     */
    protected validateCritereDTO(pCritereDTO: CritereDTO): void
    {
        // Validation de base
        if (!pCritereDTO)
        {
            throw new Error("Les critères sont requis");
        }
    }

    /**
     * Actions avant de récupérer plusieurs éléments
     */
    protected beforeGetItems(pCritereDTO: CritereDTO): void
    {
        // Par défaut ne fait rien, à surcharger si nécessaire
    }

    /**
     * Actions avant de récupérer un élément
     */
    protected beforeGetItem(pCritereDTO: CritereDTO): void
    {
        // Par défaut ne fait rien, à surcharger si nécessaire
    }


    /**
     * Actions avant de créer un élément
     */
    protected async beforeCreateItem(pDTO: DTO): Promise<DTO>
    {
        // Par défaut retourne les données telles quelles, à surcharger si nécessaire
        return pDTO;
    }

    /**
     * Actions avant de mettre à jour un élément
     */
    protected async beforeUpdateItem(pDTO: DTO, pCritereDTO: CritereDTO): Promise<DTO>
    {
        // Par défaut retourne les données telles quelles, à surcharger si nécessaire
        return pDTO;
    }

    /**
     * Actions avant de supprimer un élément
     */
    protected async beforeDeleteItem(pCritereDTO: CritereDTO): Promise<void>
    {
        // Par défaut ne fait rien, à surcharger si nécessaire
    }

    /**
     * Gestion des erreurs
     */
    protected handleError(error: any, methodName: string): void
    {
        console.error(`Erreur dans ${methodName}:`, error);
        // Logique spécifique de gestion des erreurs
    } 
    //#endregion
}