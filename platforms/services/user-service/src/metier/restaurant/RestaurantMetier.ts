import { RestaurantDTO } from "../../models/restaurant/RestaurantDTO";
import { RestaurantCritereDTO } from "../../models/restaurant/RestaurantCritereDTO";
import { BaseMetier } from "../base/BaseMetier";

/**
 * M�tier pour l'entit� Restaurant
 * @Author ModelGenerator - 2025-03-21T10:28:38.830Z - Cr�ation
 */
export class RestaurantMetier extends BaseMetier<RestaurantDTO, RestaurantCritereDTO> {
    constructor() {
        super('restaurant');
    }
}