import { StatisticDTO } from "../../models/statistic/StatisticDTO";
import { StatisticCritereDTO } from "../../models/statistic/StatisticCritereDTO";
import { BaseMetier } from "../base/BaseMetier";
import { Repository } from "../../DAL/repositories/base/Repository";
import { IRepositoryConfig } from "../../DAL/repositories/base/IRepositoryConfig";

/**
 * M�tier pour l'entit� Statistic
 * @Author ModelGenerator - 2025-03-18T11:10:29.572Z - Cr�ation
 */
export class StatisticMetier extends BaseMetier<StatisticDTO, StatisticCritereDTO> {
    constructor() {
        const config: IRepositoryConfig = {
            collectionName: 'statistic', // Collection MongoDB
            connectionString: 'mongodb://localhost:27017/projet',
            dbName: 'projet'
        };

        const repo = new Repository<StatisticDTO, StatisticCritereDTO>(config);
        super(repo);
    }
}