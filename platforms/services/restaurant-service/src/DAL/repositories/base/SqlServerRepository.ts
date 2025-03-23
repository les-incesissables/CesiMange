import { BaseCritereDTO } from "../../../models/base/BaseCritereDTO";
import { BaseDTO } from "../../../models/base/BaseDTO";
import { AbstractDbRepository } from "./AbstractDbRepository";
import { IRepositoryConfig } from "../../interfaces/IRepositoryConfig";
import * as sql from 'mssql';

/**
 * Repository de base générique pour SQL Server
 * @template DTO - Type de données retourné/manipulé qui étend BaseDTO
 * @template CritereDTO - Type des critères de recherche qui étend BaseCritereDTO
 * @author Mahmoud Charif - CESIMANGE-118 - 20/03/2025 - Implémentation pour SQL Server
 */
export class SqlServerRepository<DTO extends BaseDTO, CritereDTO extends BaseCritereDTO> extends AbstractDbRepository<DTO, CritereDTO>
{
    //#region Attributes
    protected _sqlPool: sql.ConnectionPool | undefined;
    protected _tableName: string;
    //#endregion

    //#region CTOR
    constructor (pConfig: IRepositoryConfig)
    {
        super(pConfig);
        this._tableName = pConfig.CollectionName;
    }
    //#endregion

    //#region Methods
    /**
     * Méthode d'initialisation de la connexion SQL Server
     */
    public async initialize(): Promise<void>
    {
        try
        {
            // Vérifier si la connexion existe déjà
            if (!this._sqlPool)
            {
                //// Configurer la connexion SQL Server
                //const sqlConfig: sql.config = {
                //    user: this._config.User,
                //    password: this._config.Password,
                //    database: this._config.DbName,
                //    server: this._config.Server || 'localhost',
                //    pool: {
                //        max: 10,
                //        min: 0,
                //        idleTimeoutMillis: 30000
                //    },
                //    options: {
                //        encrypt: true, // Pour Azure
                //        trustServerCertificate: true // À utiliser pour le développement local
                //    }
                //};

                //// Créer le pool de connexion
                //this._sqlPool = await new sql.ConnectionPool(sqlConfig).connect();
                console.log("Connexion SQL Server établie");
            }

            console.log(`Table '${this._tableName}' prête à l'emploi`);
        } catch (error)
        {
            console.error("Erreur lors de l'initialisation de SQL Server:", error);
            throw error;
        }
    }

    /**
     * S'assure que la connexion est établie avant d'exécuter une opération
     */
    protected async ensureConnection(): Promise<void>
    {
        if (!this._sqlPool)
        {
            await this.initialize();
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

            const { query, parameters } = this.buildSqlQuery(pCritereDTO);

            const request = this._sqlPool!.request();

            // Ajout des paramètres à la requête
            for (const [key, value] of Object.entries(parameters))
            {
                request.input(key, value);
            }

            const result = await request.query(query);
            return this.formatResults(result.recordset);
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

            const { query, parameters } = this.buildSqlQuery(pCritereDTO, true);

            const request = this._sqlPool!.request();

            // Ajout des paramètres à la requête
            for (const [key, value] of Object.entries(parameters))
            {
                request.input(key, value);
            }

            const result = await request.query(query);

            if (!result.recordset || result.recordset.length === 0)
            {
                throw new Error("Élément non trouvé");
            }

            return this.formatResults([result.recordset[0]])[0];
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

            // Préparer les données pour l'insertion
            const lData = { ...pDTO } as any;

            // Ajouter les timestamps si nécessaire
            if (!lData.createdAt)
            {
                lData.createdAt = new Date();
            }
            if (!lData.updatedAt)
            {
                lData.updatedAt = new Date();
            }

            // Construire la requête d'insertion
            const columns = Object.keys(lData).filter(key => key !== 'id' || lData.id !== undefined);
            const valueParams = columns.map(col => `@${col}`);

            const query = `
                INSERT INTO ${this._tableName} (${columns.join(', ')})
                OUTPUT INSERTED.* 
                VALUES (${valueParams.join(', ')})
            `;

            const request = this._sqlPool!.request();

            // Ajouter les paramètres
            for (const column of columns)
            {
                request.input(column, lData[column]);
            }

            // Exécuter la requête
            const result = await request.query(query);

            if (!result.recordset || result.recordset.length === 0)
            {
                throw new Error("Échec de l'insertion");
            }

            return this.formatResults([result.recordset[0]])[0];
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

            // Vérifier les critères
            const whereClause = this.buildSqlWhereClause(pCritereDTO);
            if (!whereClause.conditions)
            {
                throw new Error("Au moins un critère est requis pour la mise à jour");
            }

            // Préparer les données pour la mise à jour
            const lData = { ...pDTO } as any;
            delete lData.id; // Ne pas inclure l'id dans les champs à mettre à jour
            lData.updatedAt = new Date();

            // Construire les colonnes à mettre à jour
            const updateColumns = Object.keys(lData).map(col => `${col} = @${col}`);

            // Construire la requête de mise à jour
            const query = `
                UPDATE ${this._tableName}
                SET ${updateColumns.join(', ')}
                OUTPUT INSERTED.*
                WHERE ${whereClause.conditions}
            `;

            const request = this._sqlPool!.request();

            // Ajouter les paramètres pour les valeurs à mettre à jour
            for (const [col, value] of Object.entries(lData))
            {
                request.input(col, value);
            }

            // Ajouter les paramètres pour les conditions WHERE
            for (const [key, value] of Object.entries(whereClause.parameters))
            {
                request.input(key, value);
            }

            // Exécuter la requête
            const result = await request.query(query);

            if (!result.recordset || result.recordset.length === 0)
            {
                throw new Error("L'élément à mettre à jour n'existe pas");
            }

            return this.formatResults([result.recordset[0]])[0];
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

            // Vérifier les critères
            const whereClause = this.buildSqlWhereClause(pCritereDTO);
            if (!whereClause.conditions)
            {
                throw new Error("Au moins un critère est requis pour la suppression");
            }

            // Construire la requête de suppression
            const query = `
                DELETE FROM ${this._tableName}
                OUTPUT DELETED.id
                WHERE ${whereClause.conditions}
            `;

            const request = this._sqlPool!.request();

            // Ajouter les paramètres pour les conditions WHERE
            for (const [key, value] of Object.entries(whereClause.parameters))
            {
                request.input(key, value);
            }

            // Exécuter la requête
            const result = await request.query(query);

            return result.recordset && result.recordset.length > 0;
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

            // Vérifier les critères
            const whereClause = this.buildSqlWhereClause(pCritereDTO);
            if (!whereClause.conditions)
            {
                throw new Error("Au moins un critère est requis pour vérifier l'existence");
            }

            // Construire la requête d'existence
            const query = `
                SELECT TOP 1 1 AS exists_flag
                FROM ${this._tableName}
                WHERE ${whereClause.conditions}
            `;

            const request = this._sqlPool!.request();

            // Ajouter les paramètres pour les conditions WHERE
            for (const [key, value] of Object.entries(whereClause.parameters))
            {
                request.input(key, value);
            }

            // Exécuter la requête
            const result = await request.query(query);

            return result.recordset && result.recordset.length > 0;
        } catch (error)
        {
            console.error("Erreur lors de la vérification de l'existence:", error);
            throw error;
        }
    }
    //#endregion

    //#region Build
    /**
     * Construit un filtre MongoDB à partir des critères
     * Implémentation requise par la classe abstraite
     */
    buildFilter(pCritereDTO: CritereDTO): any
    {
        // Cette méthode est destinée à MongoDB, donc on renvoie un objet vide
        // pour SQL Server, nous utilisons buildSqlWhereClause à la place
        return {};
    }

    /**
     * Construit la clause WHERE pour SQL Server
     */
    protected buildSqlWhereClause(pCritereDTO: CritereDTO): { conditions: string, parameters: any }
    {
        const conditions: string[] = [];
        const parameters: any = {};
        const lKeyWords: string[] = ['Skip', 'SortDirection', 'Sort', 'Limit'];

        for (const [key, value] of Object.entries(pCritereDTO))
        {
            if (value !== undefined && value !== null && value !== '' && !lKeyWords.includes(key))
            {
                const paramName = `where_${key}`;

                // Gestion spéciale de l'ID
                if (key.toLowerCase() === 'id')
                {
                    conditions.push(`id = @${paramName}`);
                    parameters[paramName] = value;
                }
                // Gestion des champs "Like"
                else if (key.endsWith('Like') && typeof value === 'string')
                {
                    const fieldName = key.replace(/Like$/, '');
                    conditions.push(`${fieldName} LIKE @${paramName}`);
                    parameters[paramName] = `%${value}%`;
                }
                // Gestion des tableaux (IN)
                else if (Array.isArray(value) && value.length > 0)
                {
                    const placeholders = value.map((_, idx) => `@${paramName}_${idx}`).join(', ');
                    conditions.push(`${key} IN (${placeholders})`);

                    value.forEach((val, idx) =>
                    {
                        parameters[`${paramName}_${idx}`] = val;
                    });
                }
                // Gestion des dates
                else if (this.isDate(value))
                {
                    conditions.push(`${key} >= @${paramName}`);
                    parameters[paramName] = new Date(value);
                }
                // Gestion des autres types
                else
                {
                    conditions.push(`${key} = @${paramName}`);
                    parameters[paramName] = value;
                }
            }
        }

        // Ajouter les conditions supplémentaires spécifiques aux classes dérivées
        const additionalConditions = this.getAdditionalConditions(pCritereDTO);
        for (const [key, value] of Object.entries(additionalConditions))
        {
            if (value !== undefined && value !== null)
            {
                const paramName = `additional_${key}`;
                conditions.push(key);
                parameters[paramName] = value;
            }
        }

        return {
            conditions: conditions.join(' AND '),
            parameters
        };
    }

    /**
     * Construit la requête SQL complète
     */
    protected buildSqlQuery(pCritereDTO: CritereDTO, singleItem: boolean = false): { query: string, parameters: any }
    {
        const whereClause = this.buildSqlWhereClause(pCritereDTO);
        let query = `SELECT * FROM ${this._tableName}`;

        // Ajouter la clause WHERE si nécessaire
        if (whereClause.conditions)
        {
            query += ` WHERE ${whereClause.conditions}`;
        }

        // Ajouter le tri
        if (pCritereDTO.sort)
        {
            const direction = pCritereDTO.sortDirection ? 'DESC' : 'ASC';
            query += ` ORDER BY ${pCritereDTO.sort} ${direction}`;
        }

        // Ajouter la pagination pour les requêtes qui ne demandent pas un seul élément
        if (!singleItem)
        {
            if (pCritereDTO.skip && pCritereDTO.limit)
            {
                query += ` OFFSET ${pCritereDTO.skip} ROWS FETCH NEXT ${pCritereDTO.limit} ROWS ONLY`;
            } else if (pCritereDTO.limit)
            {
                query += ` OFFSET 0 ROWS FETCH NEXT ${pCritereDTO.limit} ROWS ONLY`;
            }
        } else
        {
            // Pour un seul élément, limiter à 1
            query += ' OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY';
        }

        return {
            query,
            parameters: whereClause.parameters
        };
    }
    //#endregion

    //#region Utils
    /**
     * Formate les résultats de SQL Server en DTOs
     */
    formatResults(pResults: any[]): DTO[]
    {
        return pResults.map(record =>
        {
            // Conversion des dates et autres formats si nécessaire
            const formattedRecord: any = {};

            for (const [key, value] of Object.entries(record))
            {
                // Conversion des dates SQL Server en objets Date JavaScript
                if (value instanceof Date)
                {
                    formattedRecord[key] = new Date(value);
                } else
                {
                    formattedRecord[key] = value;
                }
            }

            return formattedRecord as DTO;
        });
    }
    //#endregion

    /**
     * Ferme la connexion à la base de données
     */
    async disconnect(): Promise<void>
    {
        if (this._sqlPool)
        {
            await this._sqlPool.close();
            this._sqlPool = undefined;
            console.log("Connexion SQL Server fermée");
        }
    }

    /**
     * À surcharger dans les classes dérivées pour ajouter des conditions spécifiques
     */
    protected getAdditionalConditions(pCritereDTO: CritereDTO): any
    {
        return {};
    }

    /**
     * Exécute une procédure stockée SQL Server
     * @param procedureName - Nom de la procédure stockée
     * @param parameters - Paramètres à passer à la procédure
     */
    protected async executeStoredProcedure<T>(procedureName: string, parameters: any = {}): Promise<T[]>
    {
        try
        {
            await this.ensureConnection();

            const request = this._sqlPool!.request();

            // Ajouter les paramètres à la requête
            for (const [key, value] of Object.entries(parameters))
            {
                request.input(key, value);
            }

            const result = await request.execute(procedureName);

            return result.recordset as T[];
        } catch (error)
        {
            console.error(`Erreur lors de l'exécution de la procédure stockée ${procedureName}:`, error);
            throw error;
        }
    }

    /**
     * Exécute une requête SQL personnalisée
     * @param query - Requête SQL à exécuter
     * @param parameters - Paramètres à passer à la requête
     */
    protected async executeRawQuery<T>(query: string, parameters: any = {}): Promise<T[]>
    {
        try
        {
            await this.ensureConnection();

            const request = this._sqlPool!.request();

            // Ajouter les paramètres à la requête
            for (const [key, value] of Object.entries(parameters))
            {
                request.input(key, value);
            }

            const result = await request.query(query);

            return result.recordset as T[];
        } catch (error)
        {
            console.error("Erreur lors de l'exécution de la requête SQL personnalisée:", error);
            throw error;
        }
    }

    /**
     * Démarre une transaction SQL Server
     */
    protected async beginTransaction(): Promise<sql.Transaction>
    {
        try
        {
            await this.ensureConnection();

            const transaction = new sql.Transaction(this._sqlPool!);
            await transaction.begin();

            return transaction;
        } catch (error)
        {
            console.error("Erreur lors du démarrage de la transaction:", error);
            throw error;
        }
    }

    /**
     * Exécute une requête dans une transaction SQL Server
     * @param transaction - Transaction SQL Server
     * @param query - Requête SQL à exécuter
     * @param parameters - Paramètres à passer à la requête
     */
    protected async executeTransactionQuery<T>(
        transaction: sql.Transaction,
        query: string,
        parameters: any = {}
    ): Promise<T[]>
    {
        try
        {
            const request = new sql.Request(transaction);

            // Ajouter les paramètres à la requête
            for (const [key, value] of Object.entries(parameters))
            {
                request.input(key, value);
            }

            const result = await request.query(query);

            return result.recordset as T[];
        } catch (error)
        {
            console.error("Erreur lors de l'exécution de la requête dans la transaction:", error);
            throw error;
        }
    }

    /**
     * Exécute une insertion en masse dans SQL Server
     * @param items - Éléments à insérer
     */
    async bulkInsert(items: DTO[]): Promise<void>
    {
        try
        {
            await this.ensureConnection();

            if (items.length === 0)
            {
                return;
            }

            // Créer une table temporaire pour l'insertion en masse
            const table = new sql.Table(this._tableName);

            // Déterminer les colonnes à partir du premier élément
            const firstItem = items[0] as any;
            const columns = Object.keys(firstItem).filter(key => key !== 'id' || firstItem.id !== undefined);

            // Définir les colonnes de la table
            for (const column of columns)
            {
                let type: any;

                // Déterminer le type SQL à partir du type JavaScript
                const value = firstItem[column];
                if (typeof value === 'number')
                {
                    if (Number.isInteger(value))
                    {
                        type = sql.Int;
                    } else
                    {
                        type = sql.Float;
                    }
                } else if (typeof value === 'string')
                {
                    type = sql.NVarChar;
                } else if (typeof value === 'boolean')
                {
                    type = sql.Bit;
                } else if (value instanceof Date)
                {
                    type = sql.DateTime;
                } else
                {
                    // Pour les objets complexes, les stocker en JSON
                    type = sql.NVarChar;
                }

                table.columns.add(column, type, { nullable: column !== 'id' });
            }

            // Ajouter les données à la table
            for (const item of items)
            {
                const row: any[] = [];
                const itemObj = item as any;

                for (const column of columns)
                {
                    let value = itemObj[column];

                    // Convertir les objets complexes en chaînes JSON
                    if (value !== null && typeof value === 'object' && !(value instanceof Date))
                    {
                        value = JSON.stringify(value);
                    }

                    row.push(value);
                }

                table.rows.add(...row);
            }

            // Exécuter l'insertion en masse
            const request = this._sqlPool!.request();
            await request.bulk(table);

        } catch (error)
        {
            console.error("Erreur lors de l'insertion en masse:", error);
            throw error;
        }
    }

    /**
     * Execute une requête de mise à jour en masse
     * @param criteria - Critères pour identifier les éléments à mettre à jour
     * @param updateData - Données à mettre à jour
     */
    async bulkUpdate(criteria: CritereDTO, updateData: Partial<DTO>): Promise<number>
    {
        try
        {
            await this.ensureConnection();

            // Construire la clause WHERE
            const whereClause = this.buildSqlWhereClause(criteria);
            if (!whereClause.conditions)
            {
                throw new Error("Au moins un critère est requis pour la mise à jour en masse");
            }

            // Préparer les données pour la mise à jour
            const updateValues = { ...updateData } as any;
            updateValues.updatedAt = new Date();

            // Construire les colonnes à mettre à jour
            const updateColumns = Object.keys(updateValues).map(col => `${col} = @update_${col}`);

            // Construire la requête de mise à jour
            const query = `
                UPDATE ${this._tableName}
                SET ${updateColumns.join(', ')}
                OUTPUT @@ROWCOUNT AS affected_rows
                WHERE ${whereClause.conditions}
            `;

            const request = this._sqlPool!.request();

            // Ajouter les paramètres pour les valeurs à mettre à jour
            for (const [col, value] of Object.entries(updateValues))
            {
                request.input(`update_${col}`, value);
            }

            // Ajouter les paramètres pour les conditions WHERE
            for (const [key, value] of Object.entries(whereClause.parameters))
            {
                request.input(key, value);
            }

            // Exécuter la requête
            const result = await request.query(query);

            return result.recordset[0].affected_rows || 0;
        } catch (error)
        {
            console.error("Erreur lors de la mise à jour en masse:", error);
            throw error;
        }
    }

    /**
     * Exécute une requête de suppression en masse
     * @param criteria - Critères pour identifier les éléments à supprimer
     */
    async bulkDelete(criteria: CritereDTO): Promise<number>
    {
        try
        {
            await this.ensureConnection();

            // Construire la clause WHERE
            const whereClause = this.buildSqlWhereClause(criteria);
            if (!whereClause.conditions)
            {
                throw new Error("Au moins un critère est requis pour la suppression en masse");
            }

            // Construire la requête de suppression
            const query = `
                DELETE FROM ${this._tableName}
                OUTPUT @@ROWCOUNT AS affected_rows
                WHERE ${whereClause.conditions}
            `;

            const request = this._sqlPool!.request();

            // Ajouter les paramètres pour les conditions WHERE
            for (const [key, value] of Object.entries(whereClause.parameters))
            {
                request.input(key, value);
            }

            // Exécuter la requête
            const result = await request.query(query);

            return result.recordset[0].affected_rows || 0;
        } catch (error)
        {
            console.error("Erreur lors de la suppression en masse:", error);
            throw error;
        }
    }

    /**
     * Obtient le nombre total d'éléments correspondant aux critères
     * @param criteria - Critères de recherche
     */
    async getCount(criteria: CritereDTO): Promise<number>
    {
        try
        {
            await this.ensureConnection();

            const whereClause = this.buildSqlWhereClause(criteria);
            let query = `SELECT COUNT(*) AS total FROM ${this._tableName}`;

            if (whereClause.conditions)
            {
                query += ` WHERE ${whereClause.conditions}`;
            }

            const request = this._sqlPool!.request();

            // Ajouter les paramètres pour les conditions WHERE
            for (const [key, value] of Object.entries(whereClause.parameters))
            {
                request.input(key, value);
            }

            const result = await request.query(query);
            return result.recordset[0].total;
        } catch (error)
        {
            console.error("Erreur lors du comptage des éléments:", error);
            throw error;
        }
    }

    /**
     * Crée ou met à jour un élément
     * @param dto - Données pour la création ou mise à jour
     * @param idField - Nom du champ d'identifiant (par défaut 'id')
     */
    async upsertItem(dto: DTO, idField: string = 'id'): Promise<DTO>
    {
        try
        {
            await this.ensureConnection();

            const id = (dto as any)[idField];

            // Vérifier si l'élément existe déjà
            if (id)
            {
                const critereDTO = {} as CritereDTO;
                (critereDTO as any)[idField] = id;

                const exists = await this.itemExists(critereDTO);

                if (exists)
                {
                    // Mettre à jour l'élément existant
                    return await this.updateItem(dto, critereDTO);
                }
            }

            // Créer un nouvel élément
            return await this.createItem(dto);
        } catch (error)
        {
            console.error("Erreur lors de l'upsert:", error);
            throw error;
        }
    }
    //#endregion
}