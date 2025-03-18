import { IBaseRepository } from "./IBaseRepository";
import { BaseCritereDTO } from "../../../models/base/BaseCritereDTO";
import { BaseDTO } from "../../../models/base/BaseDTO";
import { IRepositoryConfig } from "./IRepositoryConfig";
import { Collection, Db, MongoClient, ObjectId } from "mongodb";

/**
 * Repository de base générique pour MongoDB
 * @template DTO - Type de données retourné/manipulé qui étend BaseDTO
 * @template CritereDTO - Type des critères de recherche qui étend BaseCritereDTO
 * @author Mahmoud Charif - CESIMANGE-118 - 17/03/2025 - Adaptation pour MongoDB
 */
export abstract class BaseRepository<DTO extends BaseDTO, CritereDTO extends BaseCritereDTO> implements IBaseRepository<DTO, CritereDTO>
{
    //#region Attributes
    protected _config: IRepositoryConfig;
    protected _db: Db | undefined;
    protected _collection: Collection | undefined;
    protected _client: MongoClient | undefined;
    //#endregion

    //#region CTOR
    constructor (pConfig: IRepositoryConfig)
    {
        this._config = pConfig;
    }
    //#endregion

    //#region Methods

    /**
     * Méthode d'initialisation de la connexion MongoDB
     */  
    async initialize(): Promise<void>
    {
        try
        {
            // Vérifier si la connexion existe déjà
            if (!this._client)
            {
                this._client = new MongoClient(this._config.connectionString);
                await this._client.connect();
                console.log("Connexion MongoDB établie");
            }

            // Initialiser la BD et la collection
            this._db = this._client.db(this._config.dbName);
            this._collection = this._db.collection(this._config.collectionName);

            console.log(`Collection '${this._config.collectionName}' prête à l'emploi`);
        } catch (error)
        {
            console.error("Erreur lors de l'initialisation de MongoDB:", error);
            throw error;
        }
    }

    //#region CRUD
    /**
    * Obtenir tous les éléments selon des critères
    * @param pCritereDTO - Critères de recherche
    */
    async getItems(pCritereDTO: CritereDTO): Promise<DTO[]>
    {
        try
        {
            await this.ensureConnection();

            const lFilter = this.buildFilter(pCritereDTO);
            const lOptions = this.buildOptions(pCritereDTO);

            const lCursor = this._collection!.find(lFilter, lOptions);
            const lResults = await lCursor.toArray();

            return this.formatResults(lResults);
        } catch (error)
        {
            console.error("Erreur lors de la récupération des items:", error);
            throw error;
        }
    }

    /**
    * Obtenir un élément par critères
    * @param pCritereDTO - Critères identifiant l'élément
    */
    async getItem(pCritereDTO: CritereDTO): Promise<DTO>
    {
        try
        {
            await this.ensureConnection();

            const lFilter = this.buildFilter(pCritereDTO);

            if (Object.keys(lFilter).length === 0)
            {
                throw new Error("Au moins un critère est requis pour obtenir un élément");
            }

            const lResult = await this._collection!.findOne(lFilter);

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
            await this.ensureConnection();

            // Préparer le document
            const lDoc = { ...pDTO } as any;

            // Gérer l'ID correctement
            if (lDoc.id)
            {
                try
                {
                    lDoc._id = new ObjectId(lDoc.id);
                } catch (error)
                {
                    // Si l'ID n'est pas valide, on le supprime pour que MongoDB en génère un
                    console.warn("ID non valide pour MongoDB, un nouvel ID sera généré");
                }
            }
            delete lDoc.id;

            // Ajouter les timestamps
            lDoc.createdAt = new Date();
            lDoc.updatedAt = new Date();

            const lResult = await this._collection!.insertOne(lDoc);

            if (!lResult.acknowledged)
            {
                throw new Error("Échec de l'insertion du document");
            }

            // Créer un objet critère pour récupérer l'élément créé
            const lCritereDTO = {} as CritereDTO;
            lCritereDTO.Id = lResult.insertedId.toString();

            return await this.getItem(lCritereDTO);
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
            await this.ensureConnection();

            const lFilter = this.buildFilter(pCritereDTO);

            if (Object.keys(lFilter).length === 0)
            {
                throw new Error("Au moins un critère est requis pour la mise à jour");
            }

            // Préparer les données à mettre à jour
            const lUpdateData = { ...pDTO } as any;
            delete lUpdateData.id; // Ne pas inclure l'id dans les champs à mettre à jour
            lUpdateData.updatedAt = new Date();

            const lResult = await this._collection!.findOneAndUpdate(
                lFilter,
                { $set: lUpdateData },
                { returnDocument: 'after' }
            );

            if (!lResult)
            {
                throw new Error("L'élément à mettre à jour n'existe pas");
            }

            return this.formatResults([lResult])[0];
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
            await this.ensureConnection();

            const lFilter = this.buildFilter(pCritereDTO);

            if (Object.keys(lFilter).length === 0)
            {
                throw new Error("Au moins un critère est requis pour la suppression");
            }

            const lResult = await this._collection!.deleteOne(lFilter);

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
            await this.ensureConnection();

            const lFilter = this.buildFilter(pCritereDTO);

            if (Object.keys(lFilter).length === 0)
            {
                throw new Error("Au moins un critère est requis pour vérifier l'existence");
            }

            const lCount = await this._collection!.countDocuments(lFilter, { limit: 1 });

            return lCount > 0;
        } catch (error)
        {
            console.error("Erreur lors de la vérification de l'existence:", error);
            throw error;
        }
    }
    //#endregion

    /**
     * S'assure que la connexion est établie avant d'exécuter une opération
     */
    protected async ensureConnection(): Promise<void>
    {
        if (!this._collection)
        {
            await this.initialize();
        }
    }

    //#region Build
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
            const sortDirection = pCritereDTO.SortDirection || 1;
            lOptions.sort = { [pCritereDTO.Sort]: sortDirection };
        }

        return lOptions;
    }


    protected buildFilter(pCritereDTO: CritereDTO): any
    {
        const lFilter: any = {};

        const processFilter = (key: string, value: any, filter: any) =>
        {
            if (value !== undefined && value !== null && value !== '')
            {
                // Gestion spéciale pour l'ID MongoDB
                if (key === 'id' || key === '_id')
                {
                    try
                    {
                        filter._id = new ObjectId(value as string);
                    } catch (error)
                    {
                        console.warn("ID non valide pour MongoDB:", value);
                    }
                }
                // Gestion des champs "Like"
                else if (key.endsWith('Like') && typeof value === 'string')
                {
                    const fieldName = key.replace(/Like$/, ''); // Supprime 'Like'
                    const escapedValue = this.escapeRegex(value);
                    filter[fieldName] = { $regex: escapedValue, $options: 'i' };
                }
                // Gestion des objets imbriqués (ex: menuLike)
                else if (typeof value === 'object' && !Array.isArray(value))
                {
                    const fieldName = key.replace(/Like$/, ''); // Supprime 'Like'
                    filter[fieldName] = { "$elemMatch": this.buildFilter(value) }; // Recherche sur les sous-objets
                }
                // Gestion des tableaux (ex: recherche avec $in)
                else if (Array.isArray(value))
                {
                    filter[key] = { $in: value };
                }
                // Gestion des tableaux (ex: recherche avec $in)
                else if (Array.isArray(value))
                {
                    filter[key] = { $in: value };
                }
                // Gestion des dates (recherche par plage de dates)
                else if (this.isDate(value))
                {
                    filter[key] = { $gte: value };

                }
                // Gestion des autres types (boolean, number, objets)
                else
                {
                    filter[key] = value;
                }
            }
        };

        // Parcourir toutes les propriétés de CritereDTO
        for (const [key, value] of Object.entries(pCritereDTO))
        {
            processFilter(key, value, lFilter);
        }

        return Object.keys(lFilter).length > 0 ? lFilter : {};
    } 
    //#endregion

    //#region Private
    private isDate(dateStr: string)
    {
        return !isNaN(new Date(dateStr).getDate());
    }
    // Fonction d'échappement des caractères spéciaux pour les regex
    private escapeRegex(value: string): string
    {
        return value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    /**
     * Formate les résultats de la base de données en DTOs
     */
    private formatResults(pResults: any[]): DTO[]
    {
        return pResults.map(lDoc =>
        {
            // Convertir _id en id pour respecter le format DTO
            const lFormatted: any = { ...lDoc, id: lDoc._id.toString() };
            delete lFormatted._id;
            return lFormatted as DTO;
        });
    } 
    //#endregion

    /**
     * Ferme la connexion à la base de données
     */
    async disconnect(): Promise<void>
    {
        if (this._client)
        {
            await this._client.close();
            this._client = undefined;
            this._db = undefined;
            this._collection = undefined;
            console.log("Connexion MongoDB fermée");
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