import { ItemDTO } from "../../models/item/ItemDTO";
import { ItemCritereDTO } from "../../models/item/ItemCritereDTO";
import { BaseMetier } from "../base/BaseMetier";
import { Repository } from "../../DAL/repositories/base/Repository";
import { IRepositoryConfig } from "../../DAL/repositories/base/IRepositoryConfig";

/**
 * M�tier pour l'entit� Item
 * @Author ModelGenerator - 2025-03-18T11:10:29.591Z - Cr�ation
 */
export class ItemMetier extends BaseMetier<ItemDTO, ItemCritereDTO> {
    constructor() {
        const config: IRepositoryConfig = {
            collectionName: 'item', // Collection MongoDB
            connectionString: 'mongodb://localhost:27017/projet',
            dbName: 'projet'
        };

        const repo = new Repository<ItemDTO, ItemCritereDTO>(config);
        super(repo);
    }
}