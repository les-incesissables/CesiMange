import { BaseDTO } from "../base/BaseDTO";

/**
 * DTO pour l'entit� Statistic
 */
export class StatisticDTO extends BaseDTO {
  metric?: string;
  value?: number;
  timestamp?: Date;
}
