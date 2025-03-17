import { BaseCritereDTO } from "../base/BaseCritereDTO";

/**
 * Crit�res de recherche pour l'entit� Component
 */
export class ComponentCritereDTO extends BaseCritereDTO {
  name?: string;
  description?: string;
  version?: string;
  tags?: string[];
}
