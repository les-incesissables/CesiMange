import { TechnicalDTO } from "../../models/technical/TechnicalDTO";
import { TechnicalCritereDTO } from "../../models/technical/TechnicalCritereDTO";
import { BaseMetier } from "../base/BaseMetier";

/**
 * M�tier pour l'entit� Technical
 * @Author ModelGenerator - 2025-03-19T19:32:22.684Z - Cr�ation
 */
export class TechnicalMetier extends BaseMetier<TechnicalDTO, TechnicalCritereDTO> {
    constructor() {
        super('technical');
    }
}