import { BaseCritereDTO } from "../base/BaseCritereDTO";

/**
 * Crit�res de recherche pour l'entit� Item
 */
export abstract class ItemCritereDTO extends BaseCritereDTO {
  name?: string;
  price?: number;
  quantity?: number;
}
