import { BaseCritereDTO } from "../base/BaseCritereDTO";

/**
 * Crit�res de recherche pour l'entit� Deliverie
 */
export abstract class DeliverieCritereDTO extends BaseCritereDTO {
  order_id?: string;
  status?: string;
  created_at?: Date;
  completed_at?: Date;
}
