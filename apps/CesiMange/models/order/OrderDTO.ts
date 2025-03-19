import { BaseDTO } from "../base/BaseDTO";
import { ItemDTO } from "../item/ItemDTO";

/**
 * DTO pour l'entit� Order
 * @Author ModelGenerator - 2025-03-19T20:04:14.493Z - Cr�ation
 */
export class OrderDTO extends BaseDTO {
  user_id?: string;
  restaurant_id?: string;
  items?: ItemDTO[];
  total_price?: number;
  status?: string;
  created_at?: Date;
}
