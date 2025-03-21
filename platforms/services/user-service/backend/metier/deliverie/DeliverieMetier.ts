import { DeliverieDTO } from "../../models/deliverie/DeliverieDTO";
import { DeliverieCritereDTO } from "../../models/deliverie/DeliverieCritereDTO";
import { BaseMetier } from "../base/BaseMetier";

/**
 * M�tier pour l'entit� Deliverie
 * @Author ModelGenerator - 2025-03-21T10:03:28.135Z - Cr�ation
 */
export class DeliverieMetier extends BaseMetier<DeliverieDTO, DeliverieCritereDTO> {
    constructor() {
        super('deliverie');
    }
}