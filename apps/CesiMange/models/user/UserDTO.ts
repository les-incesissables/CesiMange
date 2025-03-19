import { BaseDTO } from "../base/BaseDTO";

/**
 * DTO pour l'entit� User
 * @Author ModelGenerator - 2025-03-19T20:04:14.495Z - Cr�ation
 */
export class UserDTO extends BaseDTO {
  name?: string;
  email?: string;
  password?: string;
  address?: string;
  phone?: string;
}
