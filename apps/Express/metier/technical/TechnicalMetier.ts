import { TechnicalDTO } from "../../models/technical/TechnicalDTO";
import { TechnicalCritereDTO } from "../../models/technical/TechnicalCritereDTO";
import { BaseMetier } from "../base/BaseMetier";
import { Repository } from "../../DAL/repositories/base/Repository";
import { IRepositoryConfig } from "../../DAL/repositories/base/IRepositoryConfig";

/**
 * M�tier pour l'entit� Technical
 * @Author ModelGenerator - 2025-03-18T11:10:29.574Z - Cr�ation
 */
export class TechnicalMetier extends BaseMetier<TechnicalDTO, TechnicalCritereDTO> {
    constructor() {
        const config: IRepositoryConfig = {
            collectionName: 'technical', // Collection MongoDB
            connectionString: 'mongodb://localhost:27017/projet',
            dbName: 'projet'
        };

        const repo = new Repository<TechnicalDTO, TechnicalCritereDTO>(config);
        super(repo);
    }
}