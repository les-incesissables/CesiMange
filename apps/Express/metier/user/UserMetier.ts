import { UserDTO } from "../../models/user/UserDTO";
import { UserCritereDTO } from "../../models/user/UserCritereDTO";
import { BaseMetier } from "../base/BaseMetier";
import { Repository } from "../../DAL/repositories/base/Repository";
import { IRepositoryConfig } from "../../DAL/repositories/base/IRepositoryConfig";

/**
 * M�tier pour l'entit� User
 * @Author ModelGenerator - 2025-03-18T11:10:29.581Z - Cr�ation
 */
export class UserMetier extends BaseMetier<UserDTO, UserCritereDTO> {
    constructor() {
        const config: IRepositoryConfig = {
            collectionName: 'user', // Collection MongoDB
            connectionString: 'mongodb://localhost:27017/projet',
            dbName: 'projet'
        };

        const repo = new Repository<UserDTO, UserCritereDTO>(config);
        super(repo);
    }
}