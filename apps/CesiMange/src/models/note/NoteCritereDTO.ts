import { BaseCritereDTO } from "../base/BaseCritereDTO";

/**
 * Crit�res de recherche pour l'entit� Note
 */
export interface NoteCritereDTO extends BaseCritereDTO {
    utilisateurId?: string;
    utilisateurIdContient?: string;
    note?: number;
    noteMin?: number;
    noteMax?: number;
    commentaire?: string;
    commentaireContient?: string;
    date?: string;
    dateContient?: string;
}
