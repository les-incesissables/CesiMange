import { BaseDTO } from "../base/BaseDTO";

/**
 * DTO pour l'entit� Notification
 */
export class NotificationDTO extends BaseDTO {
  recipient?: string;
  message?: string;
  read?: boolean;
  created_at?: Date;
}
