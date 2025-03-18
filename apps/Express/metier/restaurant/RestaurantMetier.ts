import { RestaurantDTO } from "../../models/restaurant/RestaurantDTO";
import { RestaurantCritereDTO } from "../../models/restaurant/RestaurantCritereDTO";
import { BaseMetier } from "../base/BaseMetier";
import { Repository } from "../../DAL/repositories/base/Repository";
import { IRepositoryConfig } from "../../DAL/repositories/base/IRepositoryConfig";

/**
 * M�tier pour l'entit� Restaurant
 * @Author ModelGenerator - 2025-03-18T11:10:29.392Z - Cr�ation
 */
export class RestaurantMetier extends BaseMetier<RestaurantDTO, RestaurantCritereDTO> {
    constructor() {
        const config: IRepositoryConfig = {
            collectionName: 'restaurant', // Collection MongoDB
            connectionString: 'mongodb://localhost:27017/projet',
            dbName: 'projet'
        };

        const repo = new Repository<RestaurantDTO, RestaurantCritereDTO>(config);
        super(repo);
    }
}