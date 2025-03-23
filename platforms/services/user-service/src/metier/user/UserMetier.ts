import { IUser } from "../../models/interfaces/IUser";
import { BaseMetier } from "../base/BaseMetier";


/**
 * M�tier pour l'entit� User
 * @Author ModelGenerator - 2025-03-23T15:54:47.635Z - Cr�ation
 */
export class UserMetier extends BaseMetier<IUser, Partial<IUser>> {
    constructor() {
        super('user');
    }
}
