import { BaseDTO } from "../base/BaseDTO";

/**
 * DTO pour l'entit� Developer
 * @Author ModelGenerator - 2025-03-19T20:54:38.017Z - Cr�ation
 */
export class DeveloperDTO extends BaseDTO {
  name?: string;
  email?: string;
  password?: string;
  expertise?: string[];
}
