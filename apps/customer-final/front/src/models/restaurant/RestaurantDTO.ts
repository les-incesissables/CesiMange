import { BaseDTO } from "../base/BaseDTO";
import { MenuDTO } from "../menu/MenuDTO";

/**
 * DTO pour l'entit� Restaurant
 * @Author ModelGenerator - 2025-03-19T20:54:38.009Z - Cr�ation
 */
export class RestaurantDTO extends BaseDTO {
  name?: string;
  description?: string;
  menu?: MenuDTO[];
  address?: string;
  phone?: string;
}
