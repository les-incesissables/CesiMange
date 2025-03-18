import { MenuDTO } from "../../models/menu/MenuDTO";
import { MenuCritereDTO } from "../../models/menu/MenuCritereDTO";
import { BaseMetier } from "../base/BaseMetier";
import { Repository } from "../../DAL/repositories/base/Repository";
import { IRepositoryConfig } from "../../DAL/repositories/base/IRepositoryConfig";

/**
 * M�tier pour l'entit� Menu
 * @Author ModelGenerator - 2025-03-18T11:10:29.588Z - Cr�ation
 */
export class MenuMetier extends BaseMetier<MenuDTO, MenuCritereDTO> {
    constructor() {
        const config: IRepositoryConfig = {
            collectionName: 'menu', // Collection MongoDB
            connectionString: 'mongodb://localhost:27017/projet',
            dbName: 'projet'
        };

        const repo = new Repository<MenuDTO, MenuCritereDTO>(config);
        super(repo);
    }
}