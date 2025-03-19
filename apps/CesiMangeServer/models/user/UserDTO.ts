import { BaseDTO } from "../base/BaseDTO";

/**
 * DTO pour l'entit� User
 */
export class UserDTO extends BaseDTO {
  name?: string;
  email?: string;
  password?: string;
  address?: string;
  phone?: string;
}
