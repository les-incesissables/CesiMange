import { BaseDTO } from "../base/BaseDTO";

/**
 * DTO pour l'entit� User
 * @Author ModelGenerator - 2025-03-19T19:32:22.689Z - Cr�ation
 */
export class UserDTO extends BaseDTO {
  name?: string;
  email?: string;
  password?: string;
  address?: string;
  phone?: string;
}
