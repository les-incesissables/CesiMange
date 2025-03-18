import { DeveloperDTO } from "../../models/developer/DeveloperDTO";
import { DeveloperCritereDTO } from "../../models/developer/DeveloperCritereDTO";
import { BaseMetier } from "../base/BaseMetier";
import { Repository } from "../../DAL/repositories/base/Repository";
import { IRepositoryConfig } from "../../DAL/repositories/base/IRepositoryConfig";

/**
 * M�tier pour l'entit� Developer
 * @Author ModelGenerator - 2025-03-18T11:10:29.579Z - Cr�ation
 */
export class DeveloperMetier extends BaseMetier<DeveloperDTO, DeveloperCritereDTO> {
    constructor() {
        const config: IRepositoryConfig = {
            collectionName: 'developer', // Collection MongoDB
            connectionString: 'mongodb://localhost:27017/projet',
            dbName: 'projet'
        };

        const repo = new Repository<DeveloperDTO, DeveloperCritereDTO>(config);
        super(repo);
    }
}