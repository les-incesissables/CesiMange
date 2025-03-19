import { BaseDTO } from "../base/BaseDTO";
import { MenuDTO } from "../menu/MenuDTO";

/**
 * DTO pour l'entit� Restaurant
 */
export class RestaurantDTO extends BaseDTO {
  name?: string;
  description?: string;
  menu?: MenuDTO[];
  address?: string;
  phone?: string;
}
