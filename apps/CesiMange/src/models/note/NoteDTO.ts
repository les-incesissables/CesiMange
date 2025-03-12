import { BaseDTO } from "../base/baseDTO";

/**
 * DTO pour l'entit� Note
 */
export interface NoteDTO extends BaseDTO {
    utilisateurId?: string;
    note?: number;
    commentaire?: string;
    date?: string;
}
