import { BaseDTO } from "../base/BaseDTO";
import { ItemDTO } from "../item/ItemDTO";

/**
 * DTO pour l'entit� Order
 * @Author ModelGenerator - 2025-03-21T10:03:28.119Z - Cr�ation
 */
export class OrderDTO extends BaseDTO {
  user_id?: string;
  restaurant_id?: string;
  items?: ItemDTO[];
  total_price?: number;
  status?: string;
  created_at?: Date;
}
