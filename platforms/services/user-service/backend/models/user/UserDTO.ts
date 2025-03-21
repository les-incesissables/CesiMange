import { BaseDTO } from "../base/BaseDTO";

/**
 * DTO pour l'entit� User
 * @Author ModelGenerator - 2025-03-21T10:03:28.124Z - Cr�ation
 */
export class UserDTO extends BaseDTO {
  name?: string;
  email?: string;
  password?: string;
  address?: string;
  phone?: string;
}
