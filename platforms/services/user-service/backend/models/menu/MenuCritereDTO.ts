import { BaseCritereDTO } from "../base/BaseCritereDTO";

/**
 * Crit�res de recherche pour l'entit� Menu
 * @Author ModelGenerator - 2025-03-21T10:28:38.853Z - Cr�ation
 */
export class MenuCritereDTO extends BaseCritereDTO {
  name?: string;
  nameLike?: string;
  price?: number;
  priceMin?: number;
  priceMax?: number;
}
