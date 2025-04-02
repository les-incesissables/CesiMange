import { IRestaurant } from "../../models/interfaces/IRestaurant";
import { BaseMetier } from "../../../../../services/base-classes/src/metier/base/BaseMetier";


/**
 * M�tier pour l'entit� Restaurant
 * @Author ModelGenerator - 2025-04-01T22:33:45.901Z - Cr�ation
 */
export class RestaurantMetier extends BaseMetier<IRestaurant, Partial<IRestaurant>> {
    constructor() {
        super('restaurants');
    }
}
