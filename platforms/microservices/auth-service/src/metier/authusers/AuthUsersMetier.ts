import { AuthUsers } from '../../models/entities/authusers/AuthUsers';
import { AuthUsersCritereDTO } from '../../models/entities/authusers/AuthUsersCritereDTO';
import { BaseMetier } from '../../../../../services/base-classes/src/metier/base/BaseMetier';
import { KafkaConfig } from 'kafkajs';

import { EEventType } from 'message-broker-service/enums/EEventType';
import { ServiceBroker } from 'message-broker-service/service-broker';

/**
 * Métier pour l'entité AuthUsers
 */
export class AuthUsersMetier extends BaseMetier<AuthUsers, AuthUsersCritereDTO>
{
    private _ServiceBroker: ServiceBroker;

    constructor ()
    {
        super('AuthUsers', AuthUsers);

        // Configuration Kafka pour le ServiceBroker
        const lKafkaConfig: KafkaConfig = {
            clientId: 'auth-users-service',
            brokers: ['localhost:9092'],
        };

        this._ServiceBroker = new ServiceBroker(lKafkaConfig);
    }

    /**
     * Méthode appelée après la suppression d'un utilisateur
     * Publie un événement sur Kafka pour informer les autres services
     * @param pUser Utilisateur supprimé
     */
    override async afterDeleteItem(pUser: AuthUsers): Promise<void>
    {
        try
        {
            // cm - Publier l'événement USER_DELETED
            await this._ServiceBroker.publishEvent<number | undefined>(EEventType.USER_DELETED, pUser.id);

            console.log(`Événement ${EEventType.USER_DELETED} publié pour userId: ${pUser.id}`);
        } catch (error)
        {
            console.error("Échec de la publication de l'événement de suppression utilisateur:", error);
            // Gérez l'erreur selon votre stratégie (relancer, logger, etc.)
        }
    }

    /**
     * Méthode appelée après la suppression d'un utilisateur
     * Publie un événement sur Kafka pour informer les autres services
     * @param pUser Utilisateur supprimé
     */
    override async afterCreateItem(pUser: AuthUsers): Promise<AuthUsers>
    {
        try
        {
            // cm - Publier l'événement USER_CREATED
            await this._ServiceBroker.publishEvent<AuthUsers>(EEventType.USER_CREATED, pUser);

            console.log(`Événement ${EEventType.USER_CREATED} publié pour userId: ${pUser.id}`);
        } catch (error)
        {
            console.error("Échec de la publication de l'événement de creation utilisateur:", error);
            // Gérez l'erreur selon votre stratégie (relancer, logger, etc.)
        }

        return pUser;
    }
}
