import { IRestaurant } from "../../models/interfaces/IRestaurant";
import { BaseMetier } from "../base/BaseMetier";


/**
 * M�tier pour l'entit� Restaurant
 * @Author ModelGenerator - 2025-03-23T15:54:47.683Z - Cr�ation
 */
export class RestaurantMetier extends BaseMetier<IRestaurant, Partial<IRestaurant>> {
    constructor() {
        super('restaurant');
    }
}
