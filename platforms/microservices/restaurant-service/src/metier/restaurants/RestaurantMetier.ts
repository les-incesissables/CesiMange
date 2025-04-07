import { IRestaurant } from "../../models/interfaces/IRestaurant/IRestaurant";
import { BaseMetier } from "../../../../../services/base-classes/src/metier/base/BaseMetier";


/**
 * M�tier pour l'entit� Restaurant
 * @Author ModelGenerator - 2025-04-07T21:48:27.180Z - Cr�ation
 */
export class RestaurantMetier extends BaseMetier<IRestaurant, Partial<IRestaurant>> {
    constructor() {
        super('restaurants');
    }
}
