import { BaseDTO } from "../base/BaseDTO";

/**
 * DTO pour l'entit� Developer
 * @Author ModelGenerator - 2025-03-21T10:03:28.128Z - Cr�ation
 */
export class DeveloperDTO extends BaseDTO {
  name?: string;
  email?: string;
  password?: string;
  expertise?: string[];
}
