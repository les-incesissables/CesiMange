import { BaseCritereDTO } from "../base/BaseCritereDTO";

/**
 * Crit�res de recherche pour l'entit� Notification
 * @Author ModelGenerator - 2025-03-18T11:10:29.586Z - Cr�ation
 */
export class NotificationCritereDTO extends BaseCritereDTO {
  recipient?: string;
  recipientLike?: string;
  message?: string;
  messageLike?: string;
  read?: boolean;
  readLike?: boolean;
  created_at?: Date;
  created_atLike?: Date;
}
