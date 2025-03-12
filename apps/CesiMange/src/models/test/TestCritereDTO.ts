import { BaseCritereDTO } from "../base/BaseCritereDTO";

/**
 * Crit�res de recherche pour l'entit� Test
 */
export interface TestCritereDTO extends BaseCritereDTO {
    titre?: string;
    titreContient?: string;
    auteurId?: string;
    auteurNom?: string;
    auteurNomContient?: string;
    genres?: Genre[];
    anneePublication?: number;
    anneePublicationMin?: number;
    anneePublicationMax?: number;
    editeur?: string;
    editeurContient?: string;
    isbn?: string;
    isbnContient?: string;
    nombrePages?: number;
    nombrePagesMin?: number;
    nombrePagesMax?: number;
    langue?: string;
    langueContient?: string;
    description?: string;
    descriptionContient?: string;
    disponible?: boolean;
    exemplaires?: Exemplaire[];
    emprunts?: Emprunt[];
    notes?: Note[];
    motsCles?: string[];
    motsClesContient?: string;
    image?: string;
    imageContient?: string;
    createdAt?: string;
    createdAtContient?: string;
    updatedAt?: string;
    updatedAtContient?: string;
    deleted?: boolean;
}
