import { BaseMetier } from '../../../../../services/base-classes/src/metier/base/BaseMetier';
import { KafkaConfig } from 'kafkajs';
import { IRestaurant } from '../../models/interfaces/IRestaurant/IRestaurant';

import { EEventType } from 'message-broker-service/enums/EEventType';
import { ServiceBroker } from 'message-broker-service/service-broker';

/**
 * Métier pour l'entité Restaurant
 */
export class RestaurantMetier extends BaseMetier<IRestaurant, Partial<IRestaurant>> {
    private serviceBroker: ServiceBroker;

    constructor() {
        super('restaurants');

        // Configuration Kafka pour le ServiceBroker
        const kafkaConfig: KafkaConfig = {
            clientId: 'restaurant-service',
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
            // cm - Souscription à l'événement USER_DELETED
            await this.serviceBroker.subscribeToEvent<number | undefined>(EEventType.USER_DELETED, async (pMessage: number | undefined) => {
                await this.handleUserDeletedEvent(pMessage);
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
    private async handleUserDeletedEvent(pMessage: number | undefined): Promise<void> {
        try {
            // cm - Récupére tous les restaurants liés à cet utilisateur
            const lRestaurantCritereDTO = { owner_id: pMessage } as Partial<IRestaurant>;
            const lRestaurants = await this.getItems(lRestaurantCritereDTO);

            // Mettre à jour chaque restaurant
            for (const lRestaurant of lRestaurants) {
                // Modifier les propriétés selon vos besoins métier
                lRestaurant.status = 'closed';
                lRestaurant.updated_at = new Date();

                // Appliquer la mise à jour (exemple)
                const lRestaurantCritere = { id: lRestaurant.id };
                await this.updateItem(lRestaurant, lRestaurantCritere);

                console.log(`Restaurant ${lRestaurant.id} mis à jour suite à la suppression de l'utilisateur ${pMessage}`);
            }

            console.log(`${lRestaurants.length} restaurant(s) mis à jour suite à la suppression de l'utilisateur ${pMessage}`);
        } catch (error) {
            console.error("Erreur lors de la gestion de l'événement de suppression d'utilisateur:", error);
        }
    }
}
