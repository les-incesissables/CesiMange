import { IRepositoryConfig } from "../../DAL/repositories/base/IRepositoryConfig";
import { Repository } from "../../DAL/repositories/base/Repository";
import { RestaurantCritereDTO } from "../../models/restaurant/RestaurantCritereDTO";
import { RestaurantDTO } from "../../models/restaurant/RestaurantDTO";
import { BaseMetier } from "./BaseMetier";


/**
 * Contrôleur de base générique
 * @template DTO - Type de données retourné/manipulé
 * @template CritereDTO - Type des critères de recherche
 */
export class RestaurantMetier extends BaseMetier<RestaurantDTO, RestaurantCritereDTO>
{
    constructor ()
    {
        let lConfig: IRepositoryConfig = {
            collectionName: 'restaurants',
            connectionString: 'mongodb://localhost:27017/projet',
            dbName: 'projet'
        }
        let repo = new Repository<RestaurantDTO, RestaurantCritereDTO>(lConfig);
        super(repo);
    }
}