import { OrderDTO } from "../../models/order/OrderDTO";
import { OrderCritereDTO } from "../../models/order/OrderCritereDTO";
import { BaseMetier } from "../base/BaseMetier";

/**
 * M�tier pour l'entit� Order
 * @Author ModelGenerator - 2025-03-21T10:28:38.798Z - Cr�ation
 */
export class OrderMetier extends BaseMetier<OrderDTO, OrderCritereDTO> {
    constructor() {
        super('order');
    }
}