import { BaseCritereDTO } from "../base/BaseCritereDTO";

/**
 * Crit�res de recherche pour l'entit� Item
 * @Author ModelGenerator - 2025-03-19T20:54:38.027Z - Cr�ation
 */
export class ItemCritereDTO extends BaseCritereDTO {
  name?: string;
  nameLike?: string;
  price?: number;
  priceLike?: number;
  quantity?: number;
  quantityLike?: number;
}
