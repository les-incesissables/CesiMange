import { BaseDTO } from "../base/BaseDTO";

/**
 * DTO pour l'entit� User
 * @Author ModelGenerator - 2025-03-18T11:10:29.580Z - Cr�ation
 */
export class UserDTO extends BaseDTO {
  name?: string;
  email?: string;
  password?: string;
  address?: string;
  phone?: string;
}
