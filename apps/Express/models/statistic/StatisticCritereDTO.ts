import { BaseCritereDTO } from "../base/BaseCritereDTO";

/**
 * Crit�res de recherche pour l'entit� Statistic
 */
export class StatisticCritereDTO extends BaseCritereDTO {
  metric?: string;
  metricLike?: string;
  value?: number;
  valueLike?: number;
  timestamp?: Date;
  timestampLike?: Date;
}
