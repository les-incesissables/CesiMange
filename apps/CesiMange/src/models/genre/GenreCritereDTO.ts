import { BaseCritereDTO } from "../base/BaseCritereDTO";

/**
 * Crit�res de recherche pour l'entit� Genre
 */
export interface GenreCritereDTO extends BaseCritereDTO {
    nom?: string;
    nomContient?: string;
}
