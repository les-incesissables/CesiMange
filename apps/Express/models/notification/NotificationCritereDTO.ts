import { BaseCritereDTO } from "../base/BaseCritereDTO";

/**
 * Crit�res de recherche pour l'entit� Notification
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
