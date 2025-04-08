import mongoose, { Model, Document, FilterQuery, PipelineStage, Schema } from 'mongoose';
import { IRepositoryConfig } from '../../interfaces/IRepositoryConfig';
import { AbstractDbRepository } from './AbstractDbRepository';
import { BaseCritereDTO } from '../../models/base/BaseCritereDTO';

/**
 * Impl�mentation du repository pour Mongoose
 * @template DTO - Type de document Mongoose
 * @template CritereDTO - Type des crit�res de recherche
 */
export class MongoDBRepository<DTO extends Document, CritereDTO> extends AbstractDbRepository<DTO, CritereDTO>
{
    private _model: Model<DTO> | undefined;
    private _isConnected: boolean = false;
    private _schema: Schema | undefined;

    /**
     * Constructeur du repository Mongoose
     * @param pConfig Configuration du repository
     */
    constructor (pConfig: IRepositoryConfig)
    {
        super(pConfig);
    }

    /**
     * Initialise la connection a la base de donn�es
     */
    public async initialize(): Promise<void>
    {
        try
        {
            console.log('initialise');
            console.log(this._config.ConnectionString);
            // cm - Etabli la connexion a la base de donnees si elle n existe pas deja
            if (mongoose.connection.readyState !== 1)
            {
                await mongoose.connect(this._config.ConnectionString);
                console.log(this._config.ConnectionString);
                console.log('Connexion Mongoose �tablie');
                this._isConnected = true;
            }
            // cm - Check if model exist
            if (!mongoose.models[this._config.CollectionName])
            {
                // cm - Get Schema for the collection
                this._schema = new mongoose.Schema(
                    {},
                    {
                        strict: false,
                        collection: this._config.CollectionName,
                        timestamps: true,
                        versionKey: false,
                    }
                );

                // cm - Get Model
                this._model = mongoose.model<DTO>(this._config.CollectionName, this._schema);
            } else
            {
                // cm - use existing model
                this._model = mongoose.model<DTO>(this._config.CollectionName);
            }
        } catch (error)
        {
            console.error("Erreur lors de l'initialisation de Mongoose:", error);
            throw error;
        }
    }

    /**
     * S'assure que la connexion est �tablie
     */
    private async ensureConnection(): Promise<void>
    {
        if (!this._model)
        {
            await this.initialize();
        }
    }

    //#region CRUD
    /**
     * Obtient tous les �l�ments selon des crit�res
     * @param pCritereDTO Crit�res de recherche
     */
    async getItems(pCritereDTO: CritereDTO): Promise<DTO[]>
    {
        try
        {
            await this.ensureConnection();

            const filter = this.buildFilter(pCritereDTO);
            const options = this.buildOptions(pCritereDTO);

            let query = this._model!.find(filter);

            // Appliquer les options
            if (options.sort)
            {
                query = query.sort(options.sortDirection);
            }
            if (options.skip !== undefined)
            {
                query = query.skip(options.skip);
            }
            if (options.limit !== undefined)
            {
                query = query.limit(options.limit);
            }
            if (options.populate && options.populate.length > 0)
            {
                options.populate.forEach((field) =>
                {
                    query = query.populate(field);
                });
            }

            const results = await query.exec();
            return this.formatResults(results);
        } catch (error)
        {
            console.error('Erreur lors de la r�cup�ration des items:', error);
            throw error;
        }
    }

    /**
     * Obtient un �l�ment par crit�res
     * @param pCritereDTO Crit�res de recherche
     */
    async getItem(pCritereDTO: CritereDTO): Promise<DTO>
    {
        try
        {
            await this.ensureConnection();

            const filter = this.buildFilter(pCritereDTO);
            const options = this.buildOptions(pCritereDTO);

            if (Object.keys(filter).length === 0)
            {
                throw new Error('Au moins un crit�re est requis pour obtenir un �l�ment');
            }

            let query = this._model!.findOne(filter);

            // Appliquer les options de populate
            if (options.populate && options.populate.length > 0)
            {
                options.populate.forEach((field) =>
                {
                    query = query.populate(field);
                });
            }

            const result = await query.exec();

            if (!result)
            {
                throw new Error('�l�ment non trouv�');
            }

            return this.formatResults([result])[0];
        } catch (error)
        {
            console.error("Erreur lors de la r�cup�ration de l'item:", error);
            throw error;
        }
    }

    /**
     * Cr�e un nouvel �l�ment
     * @param pDTO Donn�es pour la cr�ation
     */
    async createItem(pDTO: DTO): Promise<DTO>
    {
        try
        {
            await this.ensureConnection();

            // Si pDTO est d�j� un document Mongoose non sauvegard�
            if (pDTO instanceof mongoose.Document && pDTO.isNew)
            {
                return this.formatResults([await pDTO.save()])[0];
            }

            const document = new this._model!(this.prepareDataForCreate(pDTO));
            const result = await document.save();

            return this.formatResults([result])[0];
        } catch (error)
        {
            console.error("Erreur lors de la cr�ation de l'item:", error);
            throw error;
        }
    }

    /**
     * Met � jour un �l�ment existant
     * @param pDTO Donn�es pour la mise � jour
     * @param pCritereDTO Crit�res identifiant l'�l�ment � mettre � jour
     */
    async updateItem(pDTO: DTO, pCritereDTO: CritereDTO): Promise<DTO>
    {
        try
        {
            await this.ensureConnection();

            // Si pDTO est un document Mongoose d�j� existant
            if (pDTO instanceof mongoose.Document && !pDTO.isNew)
            {
                return this.formatResults([await pDTO.save()])[0];
            }

            const filter = this.buildFilter(pCritereDTO);

            if (Object.keys(filter).length === 0)
            {
                throw new Error('Au moins un crit�re est requis pour la mise � jour');
            }

            const updateData = this.prepareDataForUpdate(pDTO);
            const options = { new: true, runValidators: true };

            const result = await this._model!.findOneAndUpdate(filter, updateData, options).exec();

            if (!result)
            {
                throw new Error("L'�l�ment � mettre � jour n'existe pas");
            }

            return this.formatResults([result])[0];
        } catch (error)
        {
            console.error("Erreur lors de la mise � jour de l'item:", error);
            throw error;
        }
    }

    /**
     * Supprime un �l�ment
     * @param pCritereDTO Crit�res pour la suppression
     */
    async deleteItem(pCritereDTO: CritereDTO): Promise<boolean>
    {
        try
        {
            await this.ensureConnection();

            const filter = this.buildFilter(pCritereDTO);

            if (Object.keys(filter).length === 0)
            {
                throw new Error('Au moins un crit�re est requis pour la suppression');
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
     * V�rifie si un �l�ment existe selon des crit�res
     * @param pCritereDTO Crit�res de recherche
     */
    async itemExists(pCritereDTO: CritereDTO): Promise<boolean>
    {
        try
        {
            await this.ensureConnection();

            const filter = this.buildFilter(pCritereDTO);

            if (Object.keys(filter).length === 0)
            {
                throw new Error("Au moins un crit�re est requis pour v�rifier l'existence");
            }

            const count = await this._model!.countDocuments(filter).limit(1).exec();

            return count > 0;
        } catch (error)
        {
            console.error("Erreur lors de la v�rification de l'existence:", error);
            throw error;
        }
    }

    /**
     * Compte les �l�ments selon des crit�res
     * @param pCritereDTO Crit�res de recherche
     */
    async countItems(pCritereDTO: CritereDTO): Promise<number>
    {
        try
        {
            await this.ensureConnection();

            const filter = this.buildFilter(pCritereDTO);
            const count = await this._model!.countDocuments(filter).exec();

            return count;
        } catch (error)
        {
            console.error('Erreur lors du comptage des items:', error);
            throw error;
        }
    }
    //#endregion

    /**
     * Ex�cute une agr�gation MongoDB
     * @param pipeline �tapes de l'agr�gation
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
            console.error("Erreur lors de l'agr�gation:", error);
            throw error;
        }
    }

    /**
     * Construit les options pour la requ�te Mongoose
     */
    private buildOptions(pCritereDTO: CritereDTO): BaseCritereDTO
    {
        const options: BaseCritereDTO = {};

        const criteriaObj = pCritereDTO as BaseCritereDTO;

        // Option de limite
        if (criteriaObj.limit !== undefined)
        {
            options.limit = Number(criteriaObj.limit);
        } else if (criteriaObj.limit !== undefined)
        {
            options.limit = Number(criteriaObj.limit);
        }

        // Option de saut (pagination)
        if (criteriaObj.skip !== undefined)
        {
            options.skip = Number(criteriaObj.skip);
        } else if (criteriaObj.skip !== undefined)
        {
            options.skip = Number(criteriaObj.skip);
        } else if (criteriaObj.page !== undefined && options.limit)
        {
            options.skip = (Number(criteriaObj.page) - 1) * options.limit;
        }

        // Option de population (relations)
        if (criteriaObj.populate)
        {
            options.populate = Array.isArray(criteriaObj.populate) ? criteriaObj.populate : [criteriaObj.populate];
        }

        return options;
    }

    /**
     * Construit le filtre pour la requ�te Mongoose
     */
    buildFilter(pCritereDTO: CritereDTO): FilterQuery<DTO>
    {
        // Utiliser un objet de type 'any' pour la construction du filtre
        const filter: any = {};
        const criteriaObj = pCritereDTO as any;

        // Liste des mots-cl�s � ignorer (param�tres de pagination, etc.)
        const skipFields = ['page', 'limit', 'skip', 'sort', 'order', 'populate', 'Skip', 'Limit', 'Sort', 'SortDirection'];

        // Cas sp�cial: si pCritereDTO est un document Mongoose
        if (pCritereDTO instanceof mongoose.Document && pCritereDTO._id)
        {
            filter._id = pCritereDTO._id;
            return filter as FilterQuery<DTO>;
        }

        // Parcourir tous les crit�res
        for (const [key, value] of Object.entries(criteriaObj)) {
            // Ignorer les champs de pagination et les valeurs vides
            if (skipFields.includes(key) || value === undefined || value === null || value === '') {
                continue;
            }

            // Gestion des IDs
            if (key.toLowerCase() === 'id' || key === 'Id' || key === '_id') {
                try {
                    filter._id = this.convertToObjectId(value as string);
                } catch (error) {
                    // Si l'ID n'est pas un ObjectId valide, on l'utilise tel quel
                    filter._id = value;
                }
                continue;
            }

            // Gestion des recherches "LIKE"
            if (key.endsWith('Like') && typeof value === 'string') {
                const fieldName = key.replace(/Like$/, ''); // Ex: location.cityLike -> location.city
                if (fieldName.includes('.')) {
                    // Si l'objet imbriqué (comme location.city) est trouvé, utiliser la notation pointée
                    filter[fieldName] = { $regex: this.escapeRegex(value), $options: 'i' };
                } else {
                    // Cas normal de LIKE pour des champs non imbriqués
                    filter[fieldName] = { $regex: this.escapeRegex(value), $options: 'i' };
                }
                continue;
            }

            // Gestion des opérateurs de comparaison (ex: age__gt, price__lte)
            if (key.includes('__')) {
                const [fieldName, operator] = key.split('__');

                switch (operator) {
                    case 'gt':
                        filter[fieldName] = { $gt: value };
                        break;
                    case 'gte':
                        filter[fieldName] = { $gte: value };
                        break;
                    case 'lt':
                        filter[fieldName] = { $lt: value };
                        break;
                    case 'lte':
                        filter[fieldName] = { $lte: value };
                        break;
                    case 'ne':
                        filter[fieldName] = { $ne: value };
                        break;
                    case 'in':
                        filter[fieldName] = { $in: Array.isArray(value) ? value : [value] };
                        break;
                    case 'nin':
                        filter[fieldName] = { $nin: Array.isArray(value) ? value : [value] };
                        break;
                    case 'regex':
                        filter[fieldName] = { $regex: value, $options: 'i' };
                        break;
                    case 'exists':
                        filter[fieldName] = { $exists: Boolean(value) };
                        break;
                    default:
                        // Opérateur inconnu, on utilise comme champ normal
                        filter[key] = value;
                }
                continue;
            }

            // Gestion des tableaux
            if (Array.isArray(value)) {
                filter[key] = { $in: value };
                continue;
            }

            // Gestion des objets (critères imbriqués)
            if (typeof value === 'object' && !Array.isArray(value) && value !== null && !(value instanceof Date)) {
                // Si l'objet imbriqué contient des sous-champs comme 'location.address', il faut appliquer la notation pointée
                for (const [subKey, subValue] of Object.entries(value)) {
                    const nestedField = `${key}.${subKey}`;
                    if (subKey.endsWith('Like') && typeof subValue === 'string') {
                        // Gérer les LIKE pour les objets imbriqués
                        filter[nestedField.replace('Like','')] = { $regex: this.escapeRegex(subValue), $options: 'i' };
                    } else {
                        filter[nestedField] = subValue;
                    }
                }
                continue;
            }

            // Cas par défaut
            filter[key] = value;
        }

        // Convertir le filtre 'any' en FilterQuery<DTO> � la fin
        return filter as FilterQuery<DTO>;
    }

    /**
     * Convertit une cha�ne en ObjectId MongoDB
     */
    private convertToObjectId(id: string): mongoose.Types.ObjectId
    {
        try
        {
            return new mongoose.Types.ObjectId(id);
        } catch (e)
        {
            throw new Error(`ID invalide: ${id}`);
        }
    }

    /**
     * Pr�pare les donn�es pour la cr�ation
     */
    private prepareDataForCreate(pDTO: DTO): any
    {
        // Si c'est d�j� un document Mongoose
        if (pDTO instanceof mongoose.Document)
        {
            const data = pDTO.toObject();
            // Suppression des m�tadonn�es Mongoose pour �viter les conflits
            delete data._id;
            delete data.__v;
            return data;
        }

        // V�rifier que pDTO est bien un objet avant de faire un spread
        const preparedData = typeof pDTO === 'object' && pDTO !== null ? { ...(pDTO as Record<string, any>) } : {};

        // Gestion de l'ID
        if (preparedData.id)
        {
            try
            {
                preparedData._id = this.convertToObjectId(preparedData.id);
            } catch (error)
            {
                console.warn('ID non valide pour MongoDB, un nouvel ID sera g�n�r�');
            }
            delete preparedData.id;
        }

        // Supprimer les propri�t�s Mongoose qui pourraient causer des probl�mes
        delete preparedData._id;
        delete preparedData.__v;
        delete preparedData.isNew;

        // Ajout des timestamps
        if (!preparedData.createdAt)
        {
            preparedData.createdAt = new Date();
        }
        if (!preparedData.updatedAt)
        {
            preparedData.updatedAt = new Date();
        }

        return preparedData;
    }

    /**
     * Pr�pare les donn�es pour la mise � jour
     */
    private prepareDataForUpdate(pDTO: DTO): any
    {
        // Si c'est un document Mongoose
        if (pDTO instanceof mongoose.Document)
        {
            const modifiedPaths = pDTO.modifiedPaths();
            const updateData: any = {};

            // Ne r�cup�rer que les champs modifi�s
            for (const path of modifiedPaths)
            {
                updateData[path] = (pDTO as any)[path];
            }

            // Ajouter le timestamp de mise � jour
            updateData.updatedAt = new Date();

            return { $set: updateData };
        }

        // V�rifier que pDTO est bien un objet avant de faire un spread
        const updateData = typeof pDTO === 'object' && pDTO !== null ? { ...(pDTO as Record<string, any>) } : {};

        // Suppression des IDs pour �viter les conflits
        delete updateData.id;
        delete updateData._id;
        delete updateData.__v;

        // Mise � jour du timestamp
        updateData.updatedAt = new Date();

        return { $set: updateData };
    }

    /**
     * Formate les r�sultats de Mongoose en objets standard
     */
    formatResults(results: Document[]): DTO[]
    {
        return results.map((doc) =>
        {
            // Si c'est d�j� un document Mongoose et qu'on veut le garder tel quel
            if (doc instanceof mongoose.Document)
            {
                const formatted = doc.toObject({ virtuals: true }) as any;

                // Conversion _id en id
                if (formatted._id)
                {
                    formatted.id = formatted._id.toString();
                    delete formatted._id;
                }

                // Suppression des m�tadonn�es Mongoose
                delete formatted.__v;

                return formatted as DTO;
            }

            // Pour un objet simple, v�rifier qu'il s'agit bien d'un objet
            const obj = typeof doc === 'object' && doc !== null ? { ...(doc as Record<string, any>) } : ({} as Record<string, any>);

            // Conversion _id en id
            if (obj._id)
            {
                obj.id = obj._id.toString();
                delete obj._id;
            }

            // Suppression des m�tadonn�es Mongoose
            delete obj.__v;

            return obj as DTO;
        });
    }

    /**
     * Ferme la connexion � la base de donn�es
     */
    async disconnect(): Promise<void>
    {
        this._model = undefined;

        // Si nous avons initialis� notre propre connexion, nous la fermons
        if (this._isConnected && mongoose.connection.readyState === 1)
        {
            await mongoose.disconnect();
            this._isConnected = false;
            console.log('Connexion Mongoose ferm�e');
        }
    }
}
