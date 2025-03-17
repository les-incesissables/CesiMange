import { BaseCritereDTO } from "../base/BaseCritereDTO";
import { MenuDTO } from "../menu/MenuDTO";

/**
 * Crit�res de recherche pour l'entit� Restaurant
 */
export class RestaurantCritereDTO extends BaseCritereDTO {
  name?: string;
  description?: string;
  menu?: MenuDTO[];
  address?: string;
  phone?: string;
}
