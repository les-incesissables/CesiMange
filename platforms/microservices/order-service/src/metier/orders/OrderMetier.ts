import { IOrder } from "../../models/interfaces/IOrder";
import { BaseMetier } from "../../../../../services/base-classes/src/metier/base/BaseMetier";


/**
 * M�tier pour l'entit� Order
 * @Author ModelGenerator - 2025-04-05T16:28:44.493Z - Cr�ation
 */
export class OrderMetier extends BaseMetier<IOrder, Partial<IOrder>> {
    constructor() {
        super('orders');
    }
}
