import { UserDTO } from "../../models/user/UserDTO";
import { UserCritereDTO } from "../../models/user/UserCritereDTO";
import { BaseMetier } from "../base/BaseMetier";

/**
 * M�tier pour l'entit� User
 * @Author ModelGenerator - 2025-03-19T19:32:22.690Z - Cr�ation
 */
export class UserMetier extends BaseMetier<UserDTO, UserCritereDTO> {
    constructor() {
        super('user');
    }
}