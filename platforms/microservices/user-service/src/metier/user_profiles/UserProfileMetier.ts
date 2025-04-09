import { IUserProfile } from '../../models/interfaces/IUserProfile/IUserProfile';
import { BaseMetier } from '../../../../../services/base-classes/src/metier/base/BaseMetier';
import { KafkaConfig } from 'kafkajs';

import {
    ModifiedPathsSnapshot,
    Document,
    Model,
    Types,
    ClientSession,
    DocumentSetOptions,
    QueryOptions,
    MergeType,
    UpdateQuery,
    AnyObject,
    PopulateOptions,
    Query,
    SaveOptions,
    ToObjectOptions,
    FlattenMaps,
    UpdateWithAggregationPipeline,
    pathsToSkip,
    Error,
} from 'mongoose';
import { IPreferences } from '../../models/interfaces/IUserProfile/IPreferences';
import { INotifications } from '../../models/interfaces/IUserProfile/INotifications';

import { EEventType } from 'message-broker-service/enums/EEventType';
import { ServiceBroker } from 'message-broker-service/service-broker';

/**
 * M�tier pour l'entit� UserProfile
 * @Author ModelGenerator - 2025-04-08T19:46:16.391Z - Cr�ation
 */
export class UserProfileMetier extends BaseMetier<IUserProfile, Partial<IUserProfile>> {
    private serviceBroker: ServiceBroker;

    constructor() {
        super('user_profiles');

        // Configuration Kafka pour le ServiceBroker
        const kafkaConfig: KafkaConfig = {
            clientId: 'user-service',
            brokers: ['localhost:9092', 'kafka:29092'],
        };

        this.serviceBroker = new ServiceBroker(kafkaConfig);
        this.initializeServiceBroker();
    }

    /**
     * Initialise le ServiceBroker et s'abonne aux événements nécessaires
     */
    private async initializeServiceBroker(): Promise<void> {
        try {
            // cm - Souscription à l'événement USER_CREATED
            await this.serviceBroker.subscribeToEvent<IUserProfile>(EEventType.USER_CREATED, async (pMessage: any) => {
                await this.handleUserCreatedEvent(pMessage);
            });
            console.log(`Service ${this.ServiceName} initialisé et abonné à ${EEventType.USER_DELETED}`);
        } catch (error) {
            console.error("Erreur lors de l'initialisation du ServiceBroker:", error);
        }
    }

    /**
     * Gère l'événement de suppression d'utilisateur
     * @param userId ID de l'utilisateur supprimé
     */
    private async handleUserCreatedEvent(pMessage: any): Promise<void> {
        try {
            let lNotif: INotifications = {
                email: false,
                push: false,
                sms: false,
            };
            let lPreference: IPreferences = {
                favorite_cuisines: [],
                dietary_restrictions: [],
                notifications: lNotif,
            };
            let lUserProfile: Partial<IUserProfile> = {
                user_id: pMessage.id,
                first_name: '',
                last_name: '',
                profile_picture: '',
                addresses: [],
                payment_methods: [],
                preferences: lPreference,
                favories: [],
            };

            await this.createItem(lUserProfile as IUserProfile);
        } catch (error) {
            console.error("Erreur lors de la gestion de l'événement de suppression d'utilisateur:", error);
        }
    }
}
