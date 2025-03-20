import { BaseDTO } from "../base/BaseDTO";

/**
 * DTO pour l'entit� Statistic
 * @Author ModelGenerator - 2025-03-19T19:32:22.681Z - Cr�ation
 */
export class StatisticDTO extends BaseDTO {
  metric?: string;
  value?: number;
  timestamp?: Date;
}
