import { BaseCritereDTO } from "../base/BaseCritereDTO";

/**
 * Crit�res de recherche pour l'entit� Commercial
 */
export class CommercialCritereDTO extends BaseCritereDTO {
  name?: string;
  email?: string;
  password?: string;
  department?: string;
}
