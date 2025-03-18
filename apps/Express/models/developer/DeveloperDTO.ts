import { BaseDTO } from "../base/BaseDTO";

/**
 * DTO pour l'entit� Developer
 * @Author ModelGenerator - 2025-03-18T11:10:29.578Z - Cr�ation
 */
export class DeveloperDTO extends BaseDTO {
  name?: string;
  email?: string;
  password?: string;
  expertise?: string[];
}
