import { BaseDTO } from "../base/BaseDTO";
import { MenuDTO } from "../menu/MenuDTO";

/**
 * DTO pour l'entit� Restaurant
 * @Author ModelGenerator - 2025-03-18T11:10:29.390Z - Cr�ation
 */
export class RestaurantDTO extends BaseDTO {
  name?: string;
  description?: string;
  menu?: MenuDTO[];
  address?: string;
  phone?: string;
}
