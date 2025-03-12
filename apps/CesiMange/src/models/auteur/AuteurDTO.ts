import { BaseDTO } from "../base/baseDTO";

/**
 * DTO pour l'entit� Auteur
 */
export interface AuteurDTO extends BaseDTO {
    id?: string;
    nom?: string;
    prenom?: string;
}
