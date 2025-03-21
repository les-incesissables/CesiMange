import { StatisticDTO } from "../../models/statistic/StatisticDTO";
import { StatisticCritereDTO } from "../../models/statistic/StatisticCritereDTO";
import { BaseMetier } from "../base/BaseMetier";

/**
 * M�tier pour l'entit� Statistic
 * @Author ModelGenerator - 2025-03-21T10:01:03.248Z - Cr�ation
 */
export class StatisticMetier extends BaseMetier<StatisticDTO, StatisticCritereDTO> {
    constructor() {
        super('statistic');
    }
}