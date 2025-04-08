import { BaseMetier } from "../../../../../services/base-classes/src/metier/base/BaseMetier";
import { ServiceBroker } from "../../../../../services/message-broker-service/src/service-broker";
import { KafkaConfig } from "kafkajs";
import { EEventType } from "../../../../../services/message-broker-service/src/enums/EEventType";
import { IRestaurant } from "../../models/interfaces/IRestaurant/IRestaurant";

/**
 * Métier pour l'entité Restaurant
 */
export class RestaurantMetier extends BaseMetier<IRestaurant, Partial<IRestaurant>>
{
    private serviceBroker: ServiceBroker;

    constructor ()
    {
        super('restaurants');

        // Configuration Kafka pour le ServiceBroker
        const kafkaConfig: KafkaConfig = {
            clientId: 'restaurant-service',
            brokers: ['localhost:9092'], // Ajustez selon votre configuration
        };

        this.serviceBroker = new ServiceBroker(kafkaConfig);
        this.initializeServiceBroker();
    }

    /**
     * Initialise le ServiceBroker et s'abonne aux événements nécessaires
     */
    private async initializeServiceBroker(): Promise<void>
    {
        try
        {
            // Souscription à l'événement de suppression d'utilisateur
            await this.serviceBroker.subscribeToEvent<number | undefined>(
                EEventType.USER_DELETED,
                async (pMessage: number | undefined) =>
                {
                    await this.handleUserDeletedEvent(pMessage);
                }
            );
            console.log(`Service ${this.ServiceName} initialisé et abonné à ${EEventType.USER_DELETED}`);
        } catch (error)
        {
            console.error('Erreur lors de l\'initialisation du ServiceBroker:', error);
        }
    }

    /**
     * Gère l'événement de suppression d'utilisateur
     * @param userId ID de l'utilisateur supprimé
     */
    private async handleUserDeletedEvent(pMessage: number | undefined): Promise<void>
    {
        try
        {
            // Récupérer tous les restaurants liés à cet utilisateur
            const restaurantCritereDTO = { owner_id: pMessage } as Partial<IRestaurant>;
            const restaurants = await this.getItems(restaurantCritereDTO);

            // Mettre à jour chaque restaurant
            for (const restaurant of restaurants)
            {
                // Modifier les propriétés selon vos besoins métier
                restaurant.status = 'closed';
                restaurant.updated_at = new Date();

                // Appliquer la mise à jour (exemple)
                const restaurantCritere = { id: restaurant.id };
                await this.updateItem(restaurant, restaurantCritere);

                console.log(`Restaurant ${restaurant.id} mis à jour suite à la suppression de l'utilisateur ${pMessage}`);
            }

            console.log(`${restaurants.length} restaurant(s) mis à jour suite à la suppression de l'utilisateur ${pMessage}`);
        } catch (error)
        {
            console.error('Erreur lors de la gestion de l\'événement de suppression d\'utilisateur:', error);
        }
    }
}
