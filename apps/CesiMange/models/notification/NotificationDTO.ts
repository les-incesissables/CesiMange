import { BaseDTO } from "../base/BaseDTO";

/**
 * DTO pour l'entit� Notification
 * @Author ModelGenerator - 2025-03-19T20:04:14.498Z - Cr�ation
 */
export class NotificationDTO extends BaseDTO {
  recipient?: string;
  message?: string;
  read?: boolean;
  created_at?: Date;
}
