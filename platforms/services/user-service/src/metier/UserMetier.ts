import { IUser } from "../models/interfaces/IUser";
import { userSchema } from "../models/schemas/userSchema";
import { BaseMetier } from "./base/BaseMetier";


/**
 * M�tier pour l'entit� User
 * @Author ModelGenerator - 2025-03-23T13:08:52.323Z - Cr�ation
 */
export class UserMetier extends BaseMetier<IUser, Partial<IUser>>
{
    constructor ()
    {
        super('user');
    }
}
