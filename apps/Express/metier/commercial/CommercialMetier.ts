import { CommercialDTO } from "../../models/commercial/CommercialDTO";
import { CommercialCritereDTO } from "../../models/commercial/CommercialCritereDTO";
import { BaseMetier } from "../base/BaseMetier";
import { Repository } from "../../DAL/repositories/base/Repository";
import { IRepositoryConfig } from "../../DAL/repositories/base/IRepositoryConfig";

/**
 * M�tier pour l'entit� Commercial
 * @Author ModelGenerator - 2025-03-18T11:10:29.576Z - Cr�ation
 */
export class CommercialMetier extends BaseMetier<CommercialDTO, CommercialCritereDTO> {
    constructor() {
        const config: IRepositoryConfig = {
            collectionName: 'commercial', // Collection MongoDB
            connectionString: 'mongodb://localhost:27017/projet',
            dbName: 'projet'
        };

        const repo = new Repository<CommercialDTO, CommercialCritereDTO>(config);
        super(repo);
    }
}