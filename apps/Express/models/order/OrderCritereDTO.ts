import { BaseCritereDTO } from "../base/BaseCritereDTO";
import { ItemDTO } from "../item/ItemDTO";
import { ItemCritereDTO } from "../item/ItemCritereDTO";

/**
 * Crit�res de recherche pour l'entit� Order
 */
export class OrderCritereDTO extends BaseCritereDTO {
  user_id?: string;
  user_idLike?: string;
  restaurant_id?: string;
  restaurant_idLike?: string;
  items?: ItemDTO[];
  itemsLike?: ItemCritereDTO;
  total_price?: number;
  total_priceLike?: number;
  status?: string;
  statusLike?: string;
  created_at?: Date;
  created_atLike?: Date;
}
