import { BaseDTO } from "../base/BaseDTO";

/**
 * DTO pour l'entit� Deliverie
 * @Author ModelGenerator - 2025-03-21T10:03:28.134Z - Cr�ation
 */
export class DeliverieDTO extends BaseDTO {
  order_id?: string;
  status?: string;
  created_at?: Date;
  completed_at?: Date;
}
