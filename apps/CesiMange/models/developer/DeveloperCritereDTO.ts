import { BaseCritereDTO } from "../base/BaseCritereDTO";

/**
 * Crit�res de recherche pour l'entit� Developer
 * @Author ModelGenerator - 2025-03-19T20:04:14.495Z - Cr�ation
 */
export class DeveloperCritereDTO extends BaseCritereDTO {
  name?: string;
  nameLike?: string;
  email?: string;
  emailLike?: string;
  password?: string;
  passwordLike?: string;
  expertise?: string[];
  expertiseLike?: string[];
}
