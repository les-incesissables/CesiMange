import { BaseCritereDTO } from "../base/BaseCritereDTO";

/**
 * Crit�res de recherche pour l'entit� Menu
 */
export abstract class MenuCritereDTO extends BaseCritereDTO {
  name?: string;
  price?: number;
}
