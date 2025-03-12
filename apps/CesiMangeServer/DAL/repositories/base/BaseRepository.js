"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
/**
 * Contr�leur de base g�n�rique simplifi�
 * @template DTO - Type de donn�es retourn�/manipul� qui �tend BaseDTO
 * @template CritereDTO - Type des crit�res de recherche qui �tend BaseCritereDTO
 * @author Mahmoud Charif - CESIMANGE-118 - 12/03/2025 - Creation
 */
class BaseRepository {
    constructor(pConfig) {
        this.Config = pConfig;
    }
    /**
     * Construit la condition WHERE d'une requ�te SQL � partir des crit�res
     */
    buildWhereClause(pCritereDTO) {
        const conditions = [];
        const params = [];
        if (pCritereDTO.id) {
            conditions.push("id = ?");
            params.push(pCritereDTO.id);
        }
        // Impl�mentation d'autres conditions sp�cifiques au mod�le
        const additionalConditions = this.getAdditionalConditions(pCritereDTO);
        if (additionalConditions.conditions.length > 0) {
            conditions.push(...additionalConditions.conditions);
            params.push(...additionalConditions.params);
        }
        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        return { whereClause, params };
    }
    /**
     * Obtenir tous les �l�ments selon des crit�res
     * @param pCritereDTO - Crit�res de recherche
     */
    getItems(pCritereDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { whereClause, params } = this.buildWhereClause(pCritereDTO);
                const query = `SELECT * FROM ${this.Config.table} ${whereClause}`;
                const result = yield this.executeQuery(query, params);
                return this.formatResults(result);
            }
            catch (error) {
                console.error("Erreur lors de la r�cup�ration des items:", error);
                throw error;
            }
        });
    }
    /**
     * Formate les r�sultats de la base de donn�es en DTOs
     */
    formatResults(results) {
        // Impl�mentation par d�faut - peut �tre surcharg�e
        return results;
    }
    /**
     * Obtenir un �l�ment par crit�res
     * @param pCritereDTO - Crit�res identifiant l'�l�ment
     */
    getItem(pCritereDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { whereClause, params } = this.buildWhereClause(pCritereDTO);
                if (!whereClause) {
                    throw new Error("Au moins un crit�re est requis pour obtenir un �l�ment");
                }
                const query = `SELECT * FROM ${this.Config.table} ${whereClause} LIMIT 1`;
                const lResults = yield this.executeQuery(query, params);
                if (lResults.length === 0) {
                    throw new Error("�l�ment non trouv�");
                }
                return this.formatResults(lResults)[0];
            }
            catch (error) {
                console.error("Erreur lors de la r�cup�ration de l'item:", error);
                throw error;
            }
        });
    }
    /**
     * Cr�er un nouvel �l�ment
     * @param pDTO - Donn�es pour la cr�ation
     */
    createItem(pDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Enlever l'id s'il est d�fini (g�n�ralement auto-incr�ment� par la BD)
                const item = Object.assign({}, pDTO);
                delete item.id;
                // Ajouter les timestamps
                item.createdAt = new Date();
                item.updatedAt = new Date();
                // R�cup�rer les colonnes et valeurs
                const columns = Object.keys(item);
                const placeholders = columns.map(() => '?').join(', ');
                const values = columns.map(col => item[col]);
                const query = `
                INSERT INTO ${this.Config.table} (${columns.join(', ')})
                VALUES (${placeholders})
            `;
                const result = yield this.executeQuery(query, values);
                // R�cup�rer l'�l�ment ins�r�
                const insertedId = result.insertId || result.lastID;
                return this.getItem({ id: insertedId });
            }
            catch (error) {
                console.error("Erreur lors de la cr�ation de l'item:", error);
                throw error;
            }
        });
    }
    /**
     * Mettre � jour un �l�ment existant
     * @param pDTO - Donn�es pour la mise � jour
     * @param pCritereDTO - Crit�res identifiant l'�l�ment � mettre � jour
     */
    updateItem(pDTO, pCritereDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // V�rifier si l'�l�ment existe
                const exists = yield this.itemExists(pCritereDTO);
                if (!exists) {
                    throw new Error("L'�l�ment � mettre � jour n'existe pas");
                }
                const { whereClause, params: whereParams } = this.buildWhereClause(pCritereDTO);
                if (!whereClause) {
                    throw new Error("Au moins un crit�re est requis pour la mise � jour");
                }
                // Pr�parer les donn�es � mettre � jour
                const updateData = Object.assign({}, pDTO);
                delete updateData.id; // Ne pas mettre � jour l'ID
                updateData.updatedAt = new Date();
                // Construire la requ�te SET
                const columns = Object.keys(updateData);
                const setClauses = columns.map(col => `${col} = ?`);
                const values = columns.map(col => updateData[col]);
                const query = `
                UPDATE ${this.Config.table}
                SET ${setClauses.join(', ')}
                ${whereClause}
            `;
                // Combiner les param�tres SET et WHERE
                const allParams = [...values, ...whereParams];
                yield this.executeQuery(query, allParams);
                // Retourner l'�l�ment mis � jour
                return this.getItem(pCritereDTO);
            }
            catch (error) {
                console.error("Erreur lors de la mise � jour de l'item:", error);
                throw error;
            }
        });
    }
    /**
     * Supprimer un �l�ment
     * @param pCritereDTO - Crit�res pour la suppression
     */
    deleteItem(pCritereDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { whereClause, params } = this.buildWhereClause(pCritereDTO);
                if (!whereClause) {
                    throw new Error("Au moins un crit�re est requis pour la suppression");
                }
                const query = `DELETE FROM ${this.Config.table} ${whereClause}`;
                const result = yield this.executeQuery(query, params);
                // V�rifier si des lignes ont �t� affect�es
                return result.affectedRows > 0 || result.changes > 0;
            }
            catch (error) {
                console.error("Erreur lors de la suppression de l'item:", error);
                throw error;
            }
        });
    }
    /**
     * V�rifier si un �l�ment existe selon des crit�res
     * @param pCritereDTO - Crit�res de recherche
     */
    itemExists(pCritereDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { whereClause, params } = this.buildWhereClause(pCritereDTO);
                if (!whereClause) {
                    throw new Error("Au moins un crit�re est requis pour v�rifier l'existence");
                }
                const query = `SELECT EXISTS(SELECT 1 FROM ${this.Config.table} ${whereClause}) as existe`;
                const result = yield this.executeQuery(query, params);
                return result[0].existe === 1 || result[0].existe === true;
            }
            catch (error) {
                console.error("Erreur lors de la v�rification de l'existence:", error);
                throw error;
            }
        });
    }
    /**
     * � surcharger dans les classes d�riv�es pour ajouter des conditions sp�cifiques
     */
    getAdditionalConditions(pCritereDTO) {
        return { conditions: [], params: [] };
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=BaseRepository.js.map