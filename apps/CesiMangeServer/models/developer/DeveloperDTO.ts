import { BaseDTO } from "../base/BaseDTO";

/**
 * DTO pour l'entit� Developer
 */
export class DeveloperDTO extends BaseDTO {
  name?: string;
  email?: string;
  password?: string;
  expertise?: string[];
}
