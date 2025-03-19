import { BaseDTO } from "../base/BaseDTO";

/**
 * DTO pour l'entit� Technical
 */
export class TechnicalDTO extends BaseDTO {
  name?: string;
  email?: string;
  password?: string;
  department?: string;
}
