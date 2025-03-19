import { BaseCritereDTO } from "../base/BaseCritereDTO";

/**
 * Crit�res de recherche pour l'entit� User
 * @Author ModelGenerator - 2025-03-19T20:04:14.495Z - Cr�ation
 */
export class UserCritereDTO extends BaseCritereDTO {
  name?: string;
  nameLike?: string;
  email?: string;
  emailLike?: string;
  password?: string;
  passwordLike?: string;
  address?: string;
  addressLike?: string;
  phone?: string;
  phoneLike?: string;
}
