import { CommercialDTO } from "../../models/commercial/CommercialDTO";
import { CommercialCritereDTO } from "../../models/commercial/CommercialCritereDTO";
import { BaseMetier } from "../base/BaseMetier";

/**
 * M�tier pour l'entit� Commercial
 * @Author ModelGenerator - 2025-03-19T19:32:22.685Z - Cr�ation
 */
export class CommercialMetier extends BaseMetier<CommercialDTO, CommercialCritereDTO> {
    constructor() {
        super('commercial');
    }
}