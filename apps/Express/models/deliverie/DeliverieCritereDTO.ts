import { BaseCritereDTO } from "../base/BaseCritereDTO";

/**
 * Crit�res de recherche pour l'entit� Deliverie
 */
export class DeliverieCritereDTO extends BaseCritereDTO {
  order_id?: string;
  order_idLike?: string;
  status?: string;
  statusLike?: string;
  created_at?: Date;
  created_atLike?: Date;
  completed_at?: Date;
  completed_atLike?: Date;
}
