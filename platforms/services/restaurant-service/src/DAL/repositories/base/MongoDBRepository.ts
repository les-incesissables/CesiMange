import mongoose, { Document, Model, FilterQuery, PipelineStage, UpdateQuery } from 'mongoose';
import { IRepositoryConfig } from "../../interfaces/IRepositoryConfig";
import { AbstractDbRepository } from "./AbstractDbRepository";

/**
 * Implémentation du repository pour Mongoose
 */
export class MongoDBRepository<T, U> extends AbstractDbRepository<T, U>
{
    private _model: Model<any> | undefined;

    constructor (pConfig: IRepositoryConfig)
    {
        super(pConfig);
    }

    /**
     * Initialise la connexion Mongoose
     */
    public async initialize(): Promise<void>
    {
        try
        {
            if (mongoose.connection.readyState !== 1)
            {
                await mongoose.connect(this._config.ConnectionString);
                console.log("Connexion Mongoose établie");
            }

            // Récupération du modèle (doit être préalablement défini)
            this._model = mongoose.model(this._config.CollectionName);

            if (!this._model)
            {
                throw new Error(`Modèle Mongoose '${this._config.CollectionName}' non trouvé`);
            }

            console.log(`Modèle '${this._config.CollectionName}' prêt à l'emploi`);
        } catch (error)
        {
            console.error("Erreur lors de l'initialisation de Mongoose:", error);
            throw error;
        }
    }

    /**
     * S'assure que la connexion est établie
     */
    private async ensureConnection(): Promise<void>
    {
        if (!this._model)
        {
            await this.initialize();
        }
    }

    /**
     * Obtient tous les éléments selon des critères
     */
    async getItems(criteres: U): Promise<T[]>
    {
        try
        {
            await this.ensureConnection();

            const filter = this.buildFilter(criteres);
            const options = this.buildOptions(criteres);

            let query = this._model!.find(filter);

            // Application des options
            if (options.sort)
            {
                query = query.sort(options.sort);
            }
            if (options.skip)
            {
                query = query.skip(options.skip);
            }
            if (options.limit)
            {
                query = query.limit(options.limit);
            }
            if (options.populate)
            {
                options.populate.forEach(field =>
                {
                    query = query.populate(field);
                });
            }

            const results = await query.exec();
            return this.formatResults(results);
        } catch (error)
        {
            console.error("Erreur lors de la récupération des items:", error);
            throw error;
        }
    }

    /**
     * Obtient un élément par critères
     */
    async getItem(criteres: U): Promise<T>
    {
        try
        {
            await this.ensureConnection();

            const filter = this.buildFilter(criteres);
            const options = this.buildOptions(criteres);

            if (Object.keys(filter).length === 0)
            {
                throw new Error("Au moins un critère est requis pour obtenir un élément");
            }

            let query = this._model!.findOne(filter);

            // Application des populate si nécessaire
            if (options.populate)
            {
                options.populate.forEach(field =>
                {
                    query = query.populate(field);
                });
            }

            const result = await query.exec();

            if (!result)
            {
                throw new Error("Élément non trouvé");
            }

            return this.formatResults([result])[0];
        } catch (error)
        {
            console.error("Erreur lors de la récupération de l'item:", error);
            throw error;
        }
    }

    /**
     * Crée un nouvel élément
     */
    async createItem(data: T): Promise<T>
    {
        try
        {
            await this.ensureConnection();

            const newDocument = new this._model!(data);
            const result = await newDocument.save();

            return this.formatResults([result])[0];
        } catch (error)
        {
            console.error("Erreur lors de la création de l'item:", error);
            throw error;
        }
    }

    /**
     * Met à jour un élément existant
     */
    async updateItem(data: T, criteres: U): Promise<T>
    {
        try
        {
            await this.ensureConnection();

            const filter = this.buildFilter(criteres);

            if (Object.keys(filter).length === 0)
            {
                throw new Error("Au moins un critère est requis pour la mise à jour");
            }

            // Préparation des données à mettre à jour
            const updateData = { ...data } as any;
            if (updateData.id)
            {
                delete updateData.id;
            }

            // Options pour retourner le document mis à jour
            const options = { new: true, runValidators: true };

            const result = await this._model!.findOneAndUpdate(
                filter,
                updateData as UpdateQuery<any>,
                options
            ).exec();

            if (!result)
            {
                throw new Error("L'élément à mettre à jour n'existe pas");
            }

            return this.formatResults([result])[0];
        } catch (error)
        {
            console.error("Erreur lors de la mise à jour de l'item:", error);
            throw error;
        }
    }

    /**
     * Supprime un élément
     */
    async deleteItem(criteres: U): Promise<boolean>
    {
        try
        {
            await this.ensureConnection();

            const filter = this.buildFilter(criteres);

            if (Object.keys(filter).length === 0)
            {
                throw new Error("Au moins un critère est requis pour la suppression");
            }

            const result = await this._model!.deleteOne(filter).exec();

            return result.deletedCount > 0;
        } catch (error)
        {
            console.error("Erreur lors de la suppression de l'item:", error);
            throw error;
        }
    }

    /**
     * Vérifie si un élément existe selon des critères
     */
    async itemExists(criteres: U): Promise<boolean>
    {
        try
        {
            await this.ensureConnection();

            const filter = this.buildFilter(criteres);

            if (Object.keys(filter).length === 0)
            {
                throw new Error("Au moins un critère est requis pour vérifier l'existence");
            }

            const count = await this._model!.countDocuments(filter).limit(1).exec();

            return count > 0;
        } catch (error)
        {
            console.error("Erreur lors de la vérification de l'existence:", error);
            throw error;
        }
    }

    /**
     * Compte le nombre d'éléments selon des critères
     */
    async countItems(criteres: U): Promise<number>
    {
        try
        {
            await this.ensureConnection();

            const filter = this.buildFilter(criteres);
            const count = await this._model!.countDocuments(filter).exec();

            return count;
        } catch (error)
        {
            console.error("Erreur lors du comptage des items:", error);
            throw error;
        }
    }

    /**
     * Exécute une agrégation MongoDB
     */
    async aggregate(pipeline: PipelineStage[]): Promise<any[]>
    {
        try
        {
            await this.ensureConnection();

            const results = await this._model!.aggregate(pipeline).exec();
            return results;
        } catch (error)
        {
            console.error("Erreur lors de l'agrégation:", error);
            throw error;
        }
    }

    /**
     * Construit les options de requête Mongoose
     */
    private buildOptions(criteres: U):
        {
            sort?: Record<string, 1 | -1>;
            skip?: number;
            limit?: number;
            populate?: string[];
        }
    {
        const options: {
            sort?: Record<string, 1 | -1>;
            skip?: number;
            limit?: number;
            populate?: string[];
        } = {};

        const criteresObj = criteres as any;

        // Pagination
        if (criteresObj.limit !== undefined)
        {
            options.limit = Number(criteresObj.limit);
        }

        if (criteresObj.page !== undefined && criteresObj.limit !== undefined)
        {
            options.skip = (Number(criteresObj.page) - 1) * Number(criteresObj.limit);
        } else if (criteresObj.skip !== undefined)
        {
            options.skip = Number(criteresObj.skip);
        }

        // Tri
        if (criteresObj.sort)
        {
            const direction = criteresObj.order === 'desc' ? -1 : 1;
            options.sort = { [criteresObj.sort]: direction };
        }

        // Populate
        if (criteresObj.populate)
        {
            options.populate = Array.isArray(criteresObj.populate)
                ? criteresObj.populate
                : [criteresObj.populate];
        }

        return options;
    }

    /**
     * Construit le filtre pour Mongoose
     */
    buildFilter(criteres: U): FilterQuery<any>
    {
        const filter: FilterQuery<any> = {};
        const criteresObj = criteres as any;
        const skipFields = ['page', 'limit', 'skip', 'sort', 'order', 'populate'];

        for (const [key, value] of Object.entries(criteresObj))
        {
            // Ignorer les champs pour la pagination et le tri
            if (skipFields.includes(key))
            {
                continue;
            }

            // Ignorer les valeurs vides
            if (value === undefined || value === null || value === '')
            {
                continue;
            }

            // Cas spécial pour l'identifiant
            if (key.toLowerCase() === 'id')
            {
                filter._id = value;
                continue;
            }

            // Recherche par texte (contient)
            if (key.endsWith('Like') && typeof value === 'string')
            {
                const fieldName = key.replace(/Like$/, '');
                filter[fieldName] = { $regex: value, $options: 'i' };
                continue;
            }

            // Recherche dans un tableau
            if (Array.isArray(value))
            {
                filter[key] = { $in: value };
                continue;
            }

            // Cas général
            filter[key] = value;
        }

        return filter;
    }

    /**
     * Formate les résultats de Mongoose en DTOs
     */
    formatResults(results: Document[]): T[]
    {
        return results.map(doc =>
        {
            const obj = doc.toObject ? doc.toObject() : doc;
            const formatted: any = { ...obj, id: obj._id.toString() };
            delete formatted._id;
            delete formatted.__v;
            return formatted as T;
        });
    }

    /**
     * Ferme la connexion à la base de données
     */
    async disconnect(): Promise<void>
    {
        if (mongoose.connection.readyState === 1)
        {
            await mongoose.disconnect();
            this._model = undefined;
            console.log("Connexion Mongoose fermée");
        }
    }
}