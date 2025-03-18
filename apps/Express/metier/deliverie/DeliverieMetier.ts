import { DeliverieDTO } from "../../models/deliverie/DeliverieDTO";
import { DeliverieCritereDTO } from "../../models/deliverie/DeliverieCritereDTO";
import { BaseMetier } from "../base/BaseMetier";
import { Repository } from "../../DAL/repositories/base/Repository";
import { IRepositoryConfig } from "../../DAL/repositories/base/IRepositoryConfig";

/**
 * M�tier pour l'entit� Deliverie
 * @Author ModelGenerator - 2025-03-18T11:10:29.584Z - Cr�ation
 */
export class DeliverieMetier extends BaseMetier<DeliverieDTO, DeliverieCritereDTO> {
    constructor() {
        const config: IRepositoryConfig = {
            collectionName: 'deliverie', // Collection MongoDB
            connectionString: 'mongodb://localhost:27017/projet',
            dbName: 'projet'
        };

        const repo = new Repository<DeliverieDTO, DeliverieCritereDTO>(config);
        super(repo);
    }
}