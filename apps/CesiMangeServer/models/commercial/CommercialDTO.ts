import { BaseDTO } from "../base/BaseDTO";

/**
 * DTO pour l'entit� Commercial
 */
export class CommercialDTO extends BaseDTO {
  name?: string;
  email?: string;
  password?: string;
  department?: string;
}
