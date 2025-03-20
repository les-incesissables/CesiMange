import { BaseDTO } from "../base/BaseDTO";

/**
 * DTO pour l'entit� Deliverie
 * @Author ModelGenerator - 2025-03-19T19:32:22.691Z - Cr�ation
 */
export class DeliverieDTO extends BaseDTO {
  order_id?: string;
  status?: string;
  created_at?: Date;
  completed_at?: Date;
}
