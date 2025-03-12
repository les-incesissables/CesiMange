import { BaseCritereDTO } from "../base/BaseCritereDTO";

/**
 * Crit�res de recherche pour l'entit� Exemplaire
 */
export interface ExemplaireCritereDTO extends BaseCritereDTO {
    code?: string;
    codeContient?: string;
    etat?: string;
    etatContient?: string;
    localisation?: string;
    localisationContient?: string;
    dateAcquisition?: string;
    dateAcquisitionContient?: string;
}
