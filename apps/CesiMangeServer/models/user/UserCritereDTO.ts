import { BaseCritereDTO } from "../base/BaseCritereDTO";

/**
 * Crit�res de recherche pour l'entit� User
 */
export abstract class UserCritereDTO extends BaseCritereDTO {
  name?: string;
  email?: string;
  password?: string;
  address?: string;
  phone?: string;
}
