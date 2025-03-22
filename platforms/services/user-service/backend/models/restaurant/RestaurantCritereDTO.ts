import { BaseCritereDTO } from "../base/BaseCritereDTO";
import { MenuDTO } from "../menu/MenuDTO";
import { MenuCritereDTO } from "../menu/MenuCritereDTO";

/**
 * Crit�res de recherche pour l'entit� Restaurant
 * @Author ModelGenerator - 2025-03-21T10:28:38.828Z - Cr�ation
 */
export class RestaurantCritereDTO extends BaseCritereDTO {
  name?: string;
  nameLike?: string;
  description?: string;
  descriptionLike?: string;
  menu?: MenuDTO[];
  menuLike?: MenuCritereDTO;
  address?: string;
  addressLike?: string;
  phone?: string;
  phoneLike?: string;
}
