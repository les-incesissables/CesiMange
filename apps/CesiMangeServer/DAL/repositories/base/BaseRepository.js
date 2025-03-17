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
const mongodb_1 = require("mongodb");
/**
 * Contr�leur de base g�n�rique pour MongoDB
 * @template DTO - Type de donn�es retourn�/manipul� qui �tend BaseDTO
 * @template CritereDTO - Type des crit�res de recherche qui �tend BaseCritereDTO
 * @author Mahmoud Charif - CESIMANGE-118 - 17/03/2025 - Adaptation pour MongoDB
 */
class BaseRepository {
    //#endregion
    //#region CTOR
    constructor(pConfig) {
        this._config = pConfig;
    }
    /**
     * Construit le filtre MongoDB � partir des crit�res
     */
    buildFilter(pCritereDTO) {
        const lFilter = {};
        if (pCritereDTO.Id) {
            lFilter._id = new mongodb_1.ObjectId(pCritereDTO.Id);
        }
        // Impl�mentation d'autres conditions sp�cifiques au mod�le
        const lAdditionalConditions = this.getAdditionalConditions(pCritereDTO);
        Object.assign(lFilter, lAdditionalConditions);
        return lFilter;
    }
    /**
     * Obtenir tous les �l�ments selon des crit�res
     * @param pCritereDTO - Crit�res de recherche
     */
    getItems(pCritereDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lFilter = this.buildFilter(pCritereDTO);
                const lOptions = this.buildOptions(pCritereDTO);
                const lCursor = this._collection.find(lFilter, lOptions);
                const lResults = yield lCursor.toArray();
                return this.formatResults(lResults);
            }
            catch (error) {
                console.error("Erreur lors de la r�cup�ration des items:", error);
                throw error;
            }
        });
    }
    /**
     * Construit les options de requ�te MongoDB (tri, pagination, etc.)
     */
    buildOptions(pCritereDTO) {
        const lOptions = {};
        // Pagination
        if (pCritereDTO.Limit) {
            lOptions.limit = pCritereDTO.Limit;
        }
        if (pCritereDTO.Skip) {
            lOptions.skip = pCritereDTO.Skip;
        }
        // Tri
        if (pCritereDTO.Sort) {
            lOptions.sort = pCritereDTO.Sort;
        }
        return lOptions;
    }
    /**
     * Formate les r�sultats de la base de donn�es en DTOs
     */
    formatResults(pResults) {
        return pResults.map(lDoc => {
            // Convertir _id en id pour respecter le format DTO
            const lFormatted = Object.assign(Object.assign({}, lDoc), { id: lDoc._id.toString() });
            delete lFormatted._id;
            return lFormatted;
        });
    }
    /**
     * Obtenir un �l�ment par crit�res
     * @param pCritereDTO - Crit�res identifiant l'�l�ment
     */
    getItem(pCritereDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lFilter = this.buildFilter(pCritereDTO);
                if (Object.keys(lFilter).length === 0) {
                    throw new Error("Au moins un crit�re est requis pour obtenir un �l�ment");
                }
                const lResult = yield this._collection.findOne(lFilter);
                if (!lResult) {
                    throw new Error("�l�ment non trouv�");
                }
                return this.formatResults([lResult])[0];
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
                // Pr�parer le document
                const lDoc = Object.assign({}, pDTO);
                delete lDoc.id; // MongoDB g�re automatiquement _id
                // Ajouter les timestamps
                lDoc.createdAt = new Date();
                lDoc.updatedAt = new Date();
                const lResult = yield this._collection.insertOne(lDoc);
                if (!lResult.acknowledged) {
                    throw new Error("�chec de l'insertion du document");
                }
                let CritereDTO;
                CritereDTO.Id = pDTO.id;
                return yield this.getItem(CritereDTO);
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
                const lFilter = this.buildFilter(pCritereDTO);
                if (Object.keys(lFilter).length === 0) {
                    throw new Error("Au moins un crit�re est requis pour la mise � jour");
                }
                // Pr�parer les donn�es � mettre � jour
                const lUpdateData = Object.assign({}, pDTO);
                delete lUpdateData.id; // Ne pas inclure l'id dans les champs � mettre � jour
                lUpdateData.updatedAt = new Date();
                const lResult = yield this._collection.findOneAndUpdate(lFilter, { $set: lUpdateData }, { returnDocument: 'after' });
                if (!lResult.value) {
                    throw new Error("L'�l�ment � mettre � jour n'existe pas");
                }
                return this.formatResults([lResult.value])[0];
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
                const lFilter = this.buildFilter(pCritereDTO);
                if (Object.keys(lFilter).length === 0) {
                    throw new Error("Au moins un crit�re est requis pour la suppression");
                }
                const lResult = yield this._collection.deleteOne(lFilter);
                return lResult.deletedCount > 0;
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
                const lFilter = this.buildFilter(pCritereDTO);
                if (Object.keys(lFilter).length === 0) {
                    throw new Error("Au moins un crit�re est requis pour v�rifier l'existence");
                }
                const lCount = yield this._collection.countDocuments(lFilter, { limit: 1 });
                return lCount > 0;
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
        return {};
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=BaseRepository.js.map