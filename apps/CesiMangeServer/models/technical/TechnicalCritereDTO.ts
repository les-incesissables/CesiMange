import { BaseCritereDTO } from "../base/BaseCritereDTO";

/**
 * Crit�res de recherche pour l'entit� Technical
 */
export abstract class TechnicalCritereDTO extends BaseCritereDTO {
  name?: string;
  email?: string;
  password?: string;
  department?: string;
}
