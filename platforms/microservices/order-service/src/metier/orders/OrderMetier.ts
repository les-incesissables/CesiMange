import { IOrder } from "../../models/interfaces/IOrder/IOrder";
import { BaseMetier } from "../../../../../services/base-classes/src/metier/base/BaseMetier";


/**
 * M�tier pour l'entit� Order
 * @Author ModelGenerator - 2025-04-08T07:22:46.159Z - Cr�ation
 */
export class OrderMetier extends BaseMetier<IOrder, Partial<IOrder>> {
    constructor() {
        super('orders');
    }
}
