import { BaseDTO } from "../base/baseDTO";
import { AuteurDTO } from "../auteur/AuteurDTO";

/**
 * DTO pour l'entit� Test
 */
export interface TestDTO extends BaseDTO {
    id?: string;
    titre?: string;
    auteur?: AuteurDTO;
    genres?: GenreDTO[];
    anneePublication?: number;
    editeur?: string;
    isbn?: string;
    nombrePages?: number;
    langue?: string;
    description?: string;
    disponible?: boolean;
    exemplaires?: ExemplaireDTO[];
    emprunts?: EmpruntDTO[];
    notes?: NoteDTO[];
    motsCles?: string[];
    image?: string;
    createdAt?: string;
    updatedAt?: string;
    deleted?: boolean;
}
