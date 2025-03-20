import { BaseCritereDTO } from "../base/BaseCritereDTO";

/**
 * Crit�res de recherche pour l'entit� Menu
 * @Author ModelGenerator - 2025-03-19T19:32:22.696Z - Cr�ation
 */
export class MenuCritereDTO extends BaseCritereDTO {
  name?: string;
  nameLike?: string;
  price?: number;
  priceLike?: number;
}
