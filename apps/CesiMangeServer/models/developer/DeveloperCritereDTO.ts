import { BaseCritereDTO } from "../base/BaseCritereDTO";

/**
 * Crit�res de recherche pour l'entit� Developer
 */
export abstract class DeveloperCritereDTO extends BaseCritereDTO {
  name?: string;
  email?: string;
  password?: string;
  expertise?: string[];
}
