import { NotificationDTO } from "../../models/notification/NotificationDTO";
import { NotificationCritereDTO } from "../../models/notification/NotificationCritereDTO";
import { BaseMetier } from "../base/BaseMetier";

/**
 * M�tier pour l'entit� Notification
 * @Author ModelGenerator - 2025-03-21T10:03:28.127Z - Cr�ation
 */
export class NotificationMetier extends BaseMetier<NotificationDTO, NotificationCritereDTO> {
    constructor() {
        super('notification');
    }
}