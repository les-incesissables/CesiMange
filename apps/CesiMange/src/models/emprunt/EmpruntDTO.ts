import { BaseDTO } from "../base/baseDTO";

/**
 * DTO pour l'entit� Emprunt
 */
export interface EmpruntDTO extends BaseDTO {
    utilisateurId?: string;
    exemplaire?: string;
    dateEmprunt?: string;
    dateRetourPrevue?: string;
    dateRetourEffective?: string;
}
