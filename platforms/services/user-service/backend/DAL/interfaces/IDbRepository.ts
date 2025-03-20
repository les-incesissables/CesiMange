import { BaseCritereDTO } from "../../models/base/BaseCritereDTO";
import { BaseDTO } from "../../models/base/BaseDTO";
import { IBaseRepository } from "./IBaseRepository";

/**
 * Interface pour les implémentations spécifiques de repository
 */
export interface IDbRepository<DTO extends BaseDTO, CritereDTO extends BaseCritereDTO> extends IBaseRepository<DTO, CritereDTO>
{
    /**
     * Construit le filtre pour la requête
     */
    buildFilter(pCritereDTO: CritereDTO): any;

    /**
     * Formate les résultats de la base de données
     */
    formatResults(pResults: any[]): DTO[];
}