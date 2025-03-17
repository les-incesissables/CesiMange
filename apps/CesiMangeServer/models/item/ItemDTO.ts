import { BaseDTO } from "../base/BaseDTO";

/**
 * DTO pour l'entit� Item
 */
export class ItemDTO extends BaseDTO {
  name?: string;
  price?: number;
  quantity?: number;
}
