import { BaseCritereDTO } from "../base/BaseCritereDTO";
import { ItemDTO } from "../item/ItemDTO";

/**
 * Crit�res de recherche pour l'entit� Order
 */
export class OrderCritereDTO extends BaseCritereDTO {
  user_id?: string;
  restaurant_id?: string;
  items?: ItemDTO[];
  total_price?: number;
  status?: string;
  created_at?: Date;
}
