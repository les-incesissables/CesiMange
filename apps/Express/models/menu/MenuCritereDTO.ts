import { BaseCritereDTO } from "../base/BaseCritereDTO";

/**
 * Crit�res de recherche pour l'entit� Menu
 * @Author ModelGenerator - 2025-03-18T11:10:29.588Z - Cr�ation
 */
export class MenuCritereDTO extends BaseCritereDTO {
  name?: string;
  nameLike?: string;
  price?: number;
  priceLike?: number;
}
