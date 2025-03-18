import { NotificationDTO } from "../../models/notification/NotificationDTO";
import { NotificationCritereDTO } from "../../models/notification/NotificationCritereDTO";
import { BaseMetier } from "../base/BaseMetier";
import { Repository } from "../../DAL/repositories/base/Repository";
import { IRepositoryConfig } from "../../DAL/repositories/base/IRepositoryConfig";

/**
 * M�tier pour l'entit� Notification
 * @Author ModelGenerator - 2025-03-18T11:10:29.586Z - Cr�ation
 */
export class NotificationMetier extends BaseMetier<NotificationDTO, NotificationCritereDTO> {
    constructor() {
        const config: IRepositoryConfig = {
            collectionName: 'notification', // Collection MongoDB
            connectionString: 'mongodb://localhost:27017/projet',
            dbName: 'projet'
        };

        const repo = new Repository<NotificationDTO, NotificationCritereDTO>(config);
        super(repo);
    }
}