import { BaseDTO } from "../base/baseDTO";

/**
 * DTO pour l'entit� Exemplaire
 */
export interface ExemplaireDTO extends BaseDTO {
    code?: string;
    etat?: string;
    localisation?: string;
    dateAcquisition?: string;
}
