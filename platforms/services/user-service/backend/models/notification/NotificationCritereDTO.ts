import { BaseCritereDTO } from "../base/BaseCritereDTO";

/**
 * Crit�res de recherche pour l'entit� Notification
 * @Author ModelGenerator - 2025-03-21T10:03:28.126Z - Cr�ation
 */
export class NotificationCritereDTO extends BaseCritereDTO {
  recipient?: string;
  recipientLike?: string;
  message?: string;
  messageLike?: string;
  read?: boolean;
  readLike?: boolean;
  created_at?: Date;
  created_atMin?: Date;
  created_atMax?: Date;
}
