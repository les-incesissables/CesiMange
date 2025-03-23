import { BaseCritereDTO } from "../base/BaseCritereDTO";

/**
 * Crit�res de recherche pour l'entit� Commercial
 * @Author ModelGenerator - 2025-03-21T10:28:38.840Z - Cr�ation
 */
export class CommercialCritereDTO extends BaseCritereDTO {
  name?: string;
  nameLike?: string;
  email?: string;
  emailLike?: string;
  password?: string;
  passwordLike?: string;
  department?: string;
  departmentLike?: string;
  age?: number;
  ageMin?: number;
  ageMax?: number;
}
