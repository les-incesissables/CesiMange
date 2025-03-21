import { BaseCritereDTO } from "../base/BaseCritereDTO";

/**
 * Crit�res de recherche pour l'entit� Deliverie
 * @Author ModelGenerator - 2025-03-21T10:03:28.134Z - Cr�ation
 */
export class DeliverieCritereDTO extends BaseCritereDTO {
  order_id?: string;
  order_idLike?: string;
  status?: string;
  statusLike?: string;
  created_at?: Date;
  created_atMin?: Date;
  created_atMax?: Date;
  completed_at?: Date;
  completed_atMin?: Date;
  completed_atMax?: Date;
}
