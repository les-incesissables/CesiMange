import { IUser } from "../../models/interfaces/IUser";
import { UserCritereDTO } from "../../models/UserCritereDTO";
import { User } from "../../models/User";


import { BaseMetier } from '../../../../../services/base-classes/src';
import { EDatabaseType, Repository } from "../../../../../services/data-access-layer/src";

/**
 * M�tier pour l'entit� User
 * @Author ModelGenerator - 2025-03-23T18:01:31.057Z - Cr�ation
 */
export class UserMetier extends BaseMetier<IUser, Partial<IUser>>
{
    constructor ()
    {
        super('user');
    }

    override async getItems(pCritereDTO: Partial<IUser>): Promise<IUser[]>
    {
        const lRepo = new Repository<User, UserCritereDTO>("Users", EDatabaseType.SQL_SERVER, User);

        let us = await lRepo.getItems(pCritereDTO);

        return await super.getItems(pCritereDTO);
    }
}
