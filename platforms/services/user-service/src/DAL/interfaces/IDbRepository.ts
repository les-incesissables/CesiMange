import { IBaseRepository } from "./IBaseRepository";

/**
 * Interface pour les implémentations spécifiques de repository
 */
export interface IDbRepository<DTO, CritereDTO> extends IBaseRepository<DTO, CritereDTO>
{
    /**
     * Construit le filtre pour la requête
     * @param pCritereDTO Critere de recherche
     */
    buildFilter(pCritereDTO: CritereDTO): any;

    /**
     * Formate les résultats de la base de données
     * @param pResults Resultat de la base de données
     */
    formatResults(pResults: any[]): DTO[];
}