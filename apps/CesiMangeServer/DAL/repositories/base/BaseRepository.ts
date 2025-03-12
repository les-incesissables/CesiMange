import { IBaseRepository } from "./IBaseRepository";
import { BaseCritereDTO } from "../../../models/base/BaseCritereDTO";
import { BaseDTO } from "../../../models/base/BaseDTO";
import { IRepositoryConfig } from "./IRepositoryConfig";

/**
 * Contrôleur de base générique simplifié
 * @template DTO - Type de données retourné/manipulé qui étend BaseDTO
 * @template CritereDTO - Type des critères de recherche qui étend BaseCritereDTO
 * @author Mahmoud Charif - CESIMANGE-118 - 12/03/2025 - Creation
 */
export abstract class BaseRepository<DTO extends BaseDTO, CritereDTO extends BaseCritereDTO> implements IBaseRepository<DTO, CritereDTO>
{
    protected Config: IRepositoryConfig;
    protected Db: any; // Référence à la base de données

    constructor (pConfig: IRepositoryConfig)
    {
        this.Config = pConfig;
    }

    /**
     * Méthode d'initialisation à implémenter dans les sous-classes
     */
    abstract initialize(): Promise<void>;

    /**
     * Exécute une requête (à implémenter dans les sous-classes concrètes)
     */
    protected abstract executeQuery(pQuery: string, pParams?: any[]): Promise<any>;

    /**
     * Construit la condition WHERE d'une requête SQL à partir des critères
     */
    protected buildWhereClause(pCritereDTO: CritereDTO): { whereClause: string, params: any[] }
    {
        const conditions: string[] = [];
        const params: any[] = [];

        if (pCritereDTO.id)
        {
            conditions.push("id = ?");
            params.push(pCritereDTO.id);
        }

        // Implémentation d'autres conditions spécifiques au modèle
        const additionalConditions = this.getAdditionalConditions(pCritereDTO);
        if (additionalConditions.conditions.length > 0)
        {
            conditions.push(...additionalConditions.conditions);
            params.push(...additionalConditions.params);
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        return { whereClause, params };
    }

    /**
     * Obtenir tous les éléments selon des critères
     * @param pCritereDTO - Critères de recherche
     */
    async getItems(pCritereDTO: CritereDTO): Promise<DTO[]>
    {
        try
        {
            const { whereClause, params } = this.buildWhereClause(pCritereDTO);
            const query = `SELECT * FROM ${this.Config.table} ${whereClause}`;
            const result = await this.executeQuery(query, params);
            return this.formatResults(result);
        } catch (error)
        {
            console.error("Erreur lors de la récupération des items:", error);
            throw error;
        }
    }

    /**
     * Formate les résultats de la base de données en DTOs
     */
    protected formatResults(results: any[]): DTO[]
    {
        // Implémentation par défaut - peut être surchargée
        return results as DTO[];
    }

    /**
     * Obtenir un élément par critères
     * @param pCritereDTO - Critères identifiant l'élément
     */
    async getItem(pCritereDTO: CritereDTO): Promise<DTO>
    {
        try
        {
            const { whereClause, params } = this.buildWhereClause(pCritereDTO); 

            if (!whereClause)
            {
                throw new Error("Au moins un critère est requis pour obtenir un élément");
            }

            const query = `SELECT * FROM ${this.Config.table} ${whereClause} LIMIT 1`;
            const lResults = await this.executeQuery(query, params);

            if (lResults.length === 0)
            {
                throw new Error("Élément non trouvé");
            }

            return this.formatResults(lResults)[0];
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
            // Enlever l'id s'il est défini (généralement auto-incrémenté par la BD)
            const item = { ...pDTO } as any;
            delete item.id;

            // Ajouter les timestamps
            item.createdAt = new Date();
            item.updatedAt = new Date();

            // Récupérer les colonnes et valeurs
            const columns = Object.keys(item);
            const placeholders = columns.map(() => '?').join(', ');
            const values = columns.map(col => item[col]);

            const query = `
                INSERT INTO ${this.Config.table} (${columns.join(', ')})
                VALUES (${placeholders})
            `;

            const result = await this.executeQuery(query, values);

            // Récupérer l'élément inséré
            const insertedId = result.insertId || result.lastID;
            return this.getItem({ id: insertedId } as CritereDTO);
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
            // Vérifier si l'élément existe
            const exists = await this.itemExists(pCritereDTO);
            if (!exists)
            {
                throw new Error("L'élément à mettre à jour n'existe pas");
            }

            const { whereClause, params: whereParams } = this.buildWhereClause(pCritereDTO);

            if (!whereClause)
            {
                throw new Error("Au moins un critère est requis pour la mise à jour");
            }

            // Préparer les données à mettre à jour
            const updateData = { ...pDTO } as any;
            delete updateData.id; // Ne pas mettre à jour l'ID
            updateData.updatedAt = new Date();

            // Construire la requête SET
            const columns = Object.keys(updateData);
            const setClauses = columns.map(col => `${col} = ?`);
            const values = columns.map(col => updateData[col]);

            const query = `
                UPDATE ${this.Config.table}
                SET ${setClauses.join(', ')}
                ${whereClause}
            `;

            // Combiner les paramètres SET et WHERE
            const allParams = [...values, ...whereParams];

            await this.executeQuery(query, allParams);

            // Retourner l'élément mis à jour
            return this.getItem(pCritereDTO);
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
            const { whereClause, params } = this.buildWhereClause(pCritereDTO);

            if (!whereClause)
            {
                throw new Error("Au moins un critère est requis pour la suppression");
            }

            const query = `DELETE FROM ${this.Config.table} ${whereClause}`;
            const result = await this.executeQuery(query, params);

            // Vérifier si des lignes ont été affectées
            return result.affectedRows > 0 || result.changes > 0;
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
            const { whereClause, params } = this.buildWhereClause(pCritereDTO);

            if (!whereClause)
            {
                throw new Error("Au moins un critère est requis pour vérifier l'existence");
            }

            const query = `SELECT EXISTS(SELECT 1 FROM ${this.Config.table} ${whereClause}) as existe`;
            const result = await this.executeQuery(query, params);

            return result[0].existe === 1 || result[0].existe === true;
        } catch (error)
        {
            console.error("Erreur lors de la vérification de l'existence:", error);
            throw error;
        }
    }

    /**
     * À surcharger dans les classes dérivées pour ajouter des conditions spécifiques
     */
    protected getAdditionalConditions(pCritereDTO: CritereDTO): { conditions: string[], params: any[] }
    {
        return { conditions: [], params: [] };
    }

}