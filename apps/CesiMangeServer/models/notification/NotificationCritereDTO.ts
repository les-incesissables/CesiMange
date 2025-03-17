import { BaseCritereDTO } from "../base/BaseCritereDTO";

/**
 * Crit�res de recherche pour l'entit� Notification
 */
export abstract class NotificationCritereDTO extends BaseCritereDTO {
  recipient?: string;
  message?: string;
  read?: boolean;
  created_at?: Date;
}
