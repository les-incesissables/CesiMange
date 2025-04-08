import { IOrder } from "../../models/interfaces/IOrder/IOrder";
import { BaseMetier } from "../../../../../services/base-classes/src/metier/base/BaseMetier";


/**
 * M�tier pour l'entit� Order
 * @Author ModelGenerator - 2025-04-08T19:18:06.370Z - Cr�ation
 */
export class OrderMetier extends BaseMetier<IOrder, Partial<IOrder>> {
    constructor() {
        super('orders');
    }
}
