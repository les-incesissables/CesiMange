import { BaseCritereDTO } from "../base/BaseCritereDTO";

/**
 * Crit�res de recherche pour l'entit� Item
 * @Author ModelGenerator - 2025-03-21T10:03:28.139Z - Cr�ation
 */
export class ItemCritereDTO extends BaseCritereDTO {
  name?: string;
  nameLike?: string;
  price?: number;
  priceMin?: number;
  priceMax?: number;
  quantity?: number;
  quantityMin?: number;
  quantityMax?: number;
}
