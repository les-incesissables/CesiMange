import { BaseCritereDTO } from "../base/BaseCritereDTO";

/**
 * Crit�res de recherche pour l'entit� Emprunt
 */
export interface EmpruntCritereDTO extends BaseCritereDTO {
    utilisateurId?: string;
    utilisateurIdContient?: string;
    exemplaire?: string;
    exemplaireContient?: string;
    dateEmprunt?: string;
    dateEmpruntContient?: string;
    dateRetourPrevue?: string;
    dateRetourPrevueContient?: string;
    dateRetourEffective?: string;
    dateRetourEffectiveContient?: string;
}
