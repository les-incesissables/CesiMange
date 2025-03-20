import { BaseCritereDTO } from "../base/BaseCritereDTO";

/**
 * Crit�res de recherche pour l'entit� Statistic
 * @Author ModelGenerator - 2025-03-19T19:32:22.682Z - Cr�ation
 */
export class StatisticCritereDTO extends BaseCritereDTO {
  metric?: string;
  metricLike?: string;
  value?: number;
  valueLike?: number;
  timestamp?: Date;
  timestampLike?: Date;
}
