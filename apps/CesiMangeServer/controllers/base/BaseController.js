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
exports.BaseController = void 0;
/**
 * Contr�leur de base g�n�rique
 * @template DTO - Type de donn�es retourn�/manipul�
 * @template CritereDTO - Type des crit�res de recherche
 */
class BaseController {
    constructor(repository) {
        this.repository = repository;
    }
    /**
     * Obtenir tous les �l�ments selon des crit�res
     */
    getItems(pCritereDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validation des crit�res si n�cessaire
                this.validateCritereDTO(pCritereDTO);
                // Appliquer des r�gles m�tier avant la r�cup�ration
                this.beforeGetItems(pCritereDTO);
                // D�l�guer la r�cup�ration au repository
                const items = yield this.repository.getItems(pCritereDTO);
                // Appliquer des transformations ou r�gles apr�s la r�cup�ration
                return this.afterGetItems(items, pCritereDTO);
            }
            catch (error) {
                this.handleError(error, 'getItems');
                throw error;
            }
        });
    }
    /**
     * Obtenir un �l�ment par crit�res
     */
    getItem(pCritereDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validation des crit�res
                this.validateCritereDTO(pCritereDTO);
                // Appliquer des r�gles m�tier avant la r�cup�ration
                this.beforeGetItem(pCritereDTO);
                // D�l�guer la r�cup�ration au repository
                const item = yield this.repository.getItem(pCritereDTO);
                // Appliquer des transformations ou r�gles apr�s la r�cup�ration
                return this.afterGetItem(item, pCritereDTO);
            }
            catch (error) {
                this.handleError(error, 'getItem');
                throw error;
            }
        });
    }
    /**
     * Cr�er un nouvel �l�ment
     */
    createItem(pDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validation des donn�es
                this.validateDTO(pDTO);
                // Appliquer des r�gles m�tier avant la cr�ation
                const preparedDTO = yield this.beforeCreateItem(pDTO);
                // D�l�guer la cr�ation au repository
                const item = yield this.repository.createItem(preparedDTO);
                // Appliquer des actions apr�s la cr�ation
                return this.afterCreateItem(item);
            }
            catch (error) {
                this.handleError(error, 'createItem');
                throw error;
            }
        });
    }
    /**
     * Mettre � jour un �l�ment existant
     */
    updateItem(pDTO, pCritereDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validation des donn�es et crit�res
                this.validateDTO(pDTO);
                this.validateCritereDTO(pCritereDTO);
                // Appliquer des r�gles m�tier avant la mise � jour
                const preparedDTO = yield this.beforeUpdateItem(pDTO, pCritereDTO);
                // D�l�guer la mise � jour au repository
                const item = yield this.repository.updateItem(preparedDTO, pCritereDTO);
                // Appliquer des actions apr�s la mise � jour
                return this.afterUpdateItem(item, pDTO, pCritereDTO);
            }
            catch (error) {
                this.handleError(error, 'updateItem');
                throw error;
            }
        });
    }
    /**
     * Supprimer un �l�ment
     */
    deleteItem(pCritereDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validation des crit�res
                this.validateCritereDTO(pCritereDTO);
                // Appliquer des r�gles m�tier avant la suppression
                yield this.beforeDeleteItem(pCritereDTO);
                // D�l�guer la suppression au repository
                const result = yield this.repository.deleteItem(pCritereDTO);
                // Appliquer des actions apr�s la suppression
                yield this.afterDeleteItem(result, pCritereDTO);
                return result;
            }
            catch (error) {
                this.handleError(error, 'deleteItem');
                throw error;
            }
        });
    }
    /**
     * V�rifier si un �l�ment existe selon des crit�res
     */
    itemExists(pCritereDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validation des crit�res
                this.validateCritereDTO(pCritereDTO);
                // D�l�guer la v�rification au repository
                return yield this.repository.itemExists(pCritereDTO);
            }
            catch (error) {
                this.handleError(error, 'itemExists');
                throw error;
            }
        });
    }
    //#region Validation Errors
    /**
   * Valider les donn�es avant cr�ation/mise � jour
   * � surcharger pour des validations sp�cifiques
   */
    validateDTO(pDTO) {
        // Validation de base
        if (!pDTO) {
            throw new Error("Les donn�es sont requises");
        }
    }
    /**
     * Valider les crit�res de recherche
     * � surcharger pour des validations sp�cifiques
     */
    validateCritereDTO(pCritereDTO) {
        // Validation de base
        if (!pCritereDTO) {
            throw new Error("Les crit�res sont requis");
        }
    }
    /**
     * Actions avant de r�cup�rer plusieurs �l�ments
     */
    beforeGetItems(pCritereDTO) {
        // Par d�faut ne fait rien, � surcharger si n�cessaire
    }
    /**
     * Actions apr�s avoir r�cup�r� plusieurs �l�ments
     */
    afterGetItems(items, pCritereDTO) {
        // Par d�faut retourne les �l�ments tels quels, � surcharger si n�cessaire
        return items;
    }
    /**
     * Actions avant de r�cup�rer un �l�ment
     */
    beforeGetItem(pCritereDTO) {
        // Par d�faut ne fait rien, � surcharger si n�cessaire
    }
    /**
     * Actions apr�s avoir r�cup�r� un �l�ment
     */
    afterGetItem(item, pCritereDTO) {
        // Par d�faut retourne l'�l�ment tel quel, � surcharger si n�cessaire
        return item;
    }
    /**
     * Actions avant de cr�er un �l�ment
     */
    beforeCreateItem(pDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            // Par d�faut retourne les donn�es telles quelles, � surcharger si n�cessaire
            return pDTO;
        });
    }
    /**
     * Actions apr�s avoir cr�� un �l�ment
     */
    afterCreateItem(item) {
        // Par d�faut retourne l'�l�ment tel quel, � surcharger si n�cessaire
        return item;
    }
    /**
     * Actions avant de mettre � jour un �l�ment
     */
    beforeUpdateItem(pDTO, pCritereDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            // Par d�faut retourne les donn�es telles quelles, � surcharger si n�cessaire
            return pDTO;
        });
    }
    /**
     * Actions apr�s avoir mis � jour un �l�ment
     */
    afterUpdateItem(item, originalDTO, pCritereDTO) {
        // Par d�faut retourne l'�l�ment tel quel, � surcharger si n�cessaire
        return item;
    }
    /**
     * Actions avant de supprimer un �l�ment
     */
    beforeDeleteItem(pCritereDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            // Par d�faut ne fait rien, � surcharger si n�cessaire
        });
    }
    /**
     * Actions apr�s avoir supprim� un �l�ment
     */
    afterDeleteItem(result, pCritereDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            // Par d�faut ne fait rien, � surcharger si n�cessaire
        });
    }
    /**
     * Gestion des erreurs
     */
    handleError(error, methodName) {
        console.error(`Erreur dans ${methodName}:`, error);
        // Logique sp�cifique de gestion des erreurs
    }
}
exports.BaseController = BaseController;
//# sourceMappingURL=BaseController.js.map