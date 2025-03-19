import { IBaseRepository } from "./IBaseRepository";
import { BaseCritereDTO } from "../../../models/base/BaseCritereDTO";
import { BaseDTO } from "../../../models/base/BaseDTO";
import { IRepositoryConfig } from "./IRepositoryConfig";
import { Collection, Db, ObjectId } from "mongodb";

/**
 * Contrôleur de base générique pour MongoDB
 * @template DTO - Type de données retourné/manipulé qui étend BaseDTO
 * @template CritereDTO - Type des critères de recherche qui étend BaseCritereDTO
 * @author Mahmoud Charif - CESIMANGE-118 - 17/03/2025 - Adaptation pour MongoDB
 */
export abstract class BaseRepository<DTO extends BaseDTO, CritereDTO extends BaseCritereDTO> implements IBaseRepository<DTO, CritereDTO>
{
    //#region Attributes
    protected _config: IRepositoryConfig;
    protected _db: Db;
    protected _collection: Collection; 
    //#endregion

    //#region CTOR

    constructor (pConfig: IRepositoryConfig)
    {
        this._config = pConfig;
    }

    //#endregion

    //#region Methods
    /**
* Méthode d'initialisation à implémenter dans les sous-classes
*/
    abstract initialize(): Promise<void>;

    /**
     * Construit le filtre MongoDB à partir des critères
     */
    protected buildFilter(pCritereDTO: CritereDTO): any
    {
        const lFilter: any = {};

        if (pCritereDTO.Id)
        {
            lFilter._id = new ObjectId(pCritereDTO.Id);
        }

        // Implémentation d'autres conditions spécifiques au modèle
        const lAdditionalConditions = this.getAdditionalConditions(pCritereDTO);
        Object.assign(lFilter, lAdditionalConditions);

        return lFilter;
    }

    /**
     * Obtenir tous les éléments selon des critères
     * @param pCritereDTO - Critères de recherche
     */
    async getItems(pCritereDTO: CritereDTO): Promise<DTO[]>
    {
        try
        {
            const lFilter = this.buildFilter(pCritereDTO);
            const lOptions = this.buildOptions(pCritereDTO);

            const lCursor = this._collection.find(lFilter, lOptions);
            const lResults = await lCursor.toArray();

            return this.formatResults(lResults);
        } catch (error)
        {
            console.error("Erreur lors de la récupération des items:", error);
            throw error;
        }
    }

    /**
     * Construit les options de requête MongoDB (tri, pagination, etc.)
     */
    protected buildOptions(pCritereDTO: CritereDTO): any
    {
        const lOptions: any = {};

        // Pagination
        if (pCritereDTO.Limit)
        {
            lOptions.limit = pCritereDTO.Limit;
        }

        if (pCritereDTO.Skip)
        {
            lOptions.skip = pCritereDTO.Skip;
        }

        // Tri
        if (pCritereDTO.Sort)
        {
            lOptions.sort = pCritereDTO.Sort;
        }

        return lOptions;
    }

    /**
     * Formate les résultats de la base de données en DTOs
     */
    protected formatResults(pResults: any[]): DTO[]
    {
        return pResults.map(lDoc =>
        {
            // Convertir _id en id pour respecter le format DTO
            const lFormatted: any = { ...lDoc, id: lDoc._id.toString() };
            delete lFormatted._id;
            return lFormatted as DTO;
        });
    }

    /**
     * Obtenir un élément par critères
     * @param pCritereDTO - Critères identifiant l'élément
     */
    async getItem(pCritereDTO: CritereDTO): Promise<DTO>
    {
        try
        {
            const lFilter = this.buildFilter(pCritereDTO);

            if (Object.keys(lFilter).length === 0)
            {
                throw new Error("Au moins un critère est requis pour obtenir un élément");
            }

            const lResult = await this._collection.findOne(lFilter);

            if (!lResult)
            {
                throw new Error("Élément non trouvé");
            }

            return this.formatResults([lResult])[0];
        } catch (error)
        {
            console.error("Erreur lors de la récupération de l'item:", error);
            throw error;
        }
    }

    /**
     * Créer un nouvel élément
     * @param pDTO - Données pour la création
     */
    async createItem(pDTO: DTO): Promise<DTO>
    {
        try
        {
            // Préparer le document
            const lDoc = { ...pDTO } as any;
            delete lDoc.id; // MongoDB gère automatiquement _id

            // Ajouter les timestamps
            lDoc.createdAt = new Date();
            lDoc.updatedAt = new Date();

            const lResult = await this._collection.insertOne(lDoc);

            if (!lResult.acknowledged)
            {
                throw new Error("Échec de l'insertion du document");
            }
            let CritereDTO: CritereDTO;
            CritereDTO.Id = pDTO.id;
            return await this.getItem(CritereDTO);

        } catch (error)
        {
            console.error("Erreur lors de la création de l'item:", error);
            throw error;
        }
    }

    /**
     * Mettre à jour un élément existant
     * @param pDTO - Données pour la mise à jour
     * @param pCritereDTO - Critères identifiant l'élément à mettre à jour
     */
    async updateItem(pDTO: DTO, pCritereDTO: CritereDTO): Promise<DTO>
    {
        try
        {
            const lFilter = this.buildFilter(pCritereDTO);

            if (Object.keys(lFilter).length === 0)
            {
                throw new Error("Au moins un critère est requis pour la mise à jour");
            }

            // Préparer les données à mettre à jour
            const lUpdateData = { ...pDTO } as any;
            delete lUpdateData.id; // Ne pas inclure l'id dans les champs à mettre à jour
            lUpdateData.updatedAt = new Date();

            const lResult = await this._collection.findOneAndUpdate(
                lFilter,
                { $set: lUpdateData },
                { returnDocument: 'after' }
            );

            if (!lResult.value)
            {
                throw new Error("L'élément à mettre à jour n'existe pas");
            }

            return this.formatResults([lResult.value])[0];
        } catch (error)
        {
            console.error("Erreur lors de la mise à jour de l'item:", error);
            throw error;
        }
    }

    /**
     * Supprimer un élément
     * @param pCritereDTO - Critères pour la suppression
     */
    async deleteItem(pCritereDTO: CritereDTO): Promise<boolean>
    {
        try
        {
            const lFilter = this.buildFilter(pCritereDTO);

            if (Object.keys(lFilter).length === 0)
            {
                throw new Error("Au moins un critère est requis pour la suppression");
            }

            const lResult = await this._collection.deleteOne(lFilter);

            return lResult.deletedCount > 0;
        } catch (error)
        {
            console.error("Erreur lors de la suppression de l'item:", error);
            throw error;
        }
    }

    /**
     * Vérifier si un élément existe selon des critères
     * @param pCritereDTO - Critères de recherche
     */
    async itemExists(pCritereDTO: CritereDTO): Promise<boolean>
    {
        try
        {
            const lFilter = this.buildFilter(pCritereDTO);

            if (Object.keys(lFilter).length === 0)
            {
                throw new Error("Au moins un critère est requis pour vérifier l'existence");
            }

            const lCount = await this._collection.countDocuments(lFilter, { limit: 1 });

            return lCount > 0;
        } catch (error)
        {
            console.error("Erreur lors de la vérification de l'existence:", error);
            throw error;
        }
    }

    /**
     * À surcharger dans les classes dérivées pour ajouter des conditions spécifiques
     */
    protected getAdditionalConditions(pCritereDTO: CritereDTO): any
    {
        return {};
    } 
    //#endregion
}