import { BaseCritereDTO } from "../base/BaseCritereDTO";

/**
 * Crit�res de recherche pour l'entit� Auteur
 */
export interface AuteurCritereDTO extends BaseCritereDTO {
    nom?: string;
    nomContient?: string;
    prenom?: string;
    prenomContient?: string;
}
