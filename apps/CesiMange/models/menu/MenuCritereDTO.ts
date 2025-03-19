import { BaseCritereDTO } from "../base/BaseCritereDTO";

/**
 * Crit�res de recherche pour l'entit� Menu
 * @Author ModelGenerator - 2025-03-19T20:04:14.500Z - Cr�ation
 */
export class MenuCritereDTO extends BaseCritereDTO {
  name?: string;
  nameLike?: string;
  price?: number;
  priceLike?: number;
}
