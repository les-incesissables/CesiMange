import { BaseDTO } from "../base/BaseDTO";

/**
 * DTO pour l'entit� Notification
 * @Author ModelGenerator - 2025-03-18T11:10:29.585Z - Cr�ation
 */
export class NotificationDTO extends BaseDTO {
  recipient?: string;
  message?: string;
  read?: boolean;
  created_at?: Date;
}
