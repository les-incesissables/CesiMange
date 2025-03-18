import { BaseDTO } from "../base/BaseDTO";

/**
 * DTO pour l'entit� Statistic
 * @Author ModelGenerator - 2025-03-18T11:10:29.571Z - Cr�ation
 */
export class StatisticDTO extends BaseDTO {
  metric?: string;
  value?: number;
  timestamp?: Date;
}
