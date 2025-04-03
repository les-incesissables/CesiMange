import { IRestaurant } from "../../models/interfaces/IRestaurant";
import { BaseMetier } from "../../../../../services/base-classes/src/metier/base/BaseMetier";
import { KafkaRepository } from "../../../../../services/data-access-layer/src/repositories/base/KafkaRepository";
import { IRepositoryConfig, EDatabaseType } from "../../../../../services/data-access-layer/src";
import { IMessage } from "../../../../../services/base-classes/src/interfaces/IMessage";
import { EEventType } from "../../../../../services/base-classes/src/enums/EEventType";


/**
 * Métier pour l'entité Restaurant
 * @Author ModelGenerator - 2025-04-02T16:35:47.272Z - Création
 */
export class RestaurantMetier extends BaseMetier<IRestaurant, Partial<IRestaurant>>
{
    private kafkaRepository: KafkaRepository<IRestaurant, any>;

    constructor ()
    {
        super('restaurants');

        // Configuration du repository Kafka pour les événements restaurants
        const kafkaConfig: IRepositoryConfig = {
            CollectionName: '',
            ConnectionString: '',
            DbName: '',
            TypeBDD: EDatabaseType.KAFKA,
            clientId: 'restaurant-service',
            brokers: ['localhost:9092'], // Ajustez selon votre configuration
            groupId: 'restaurant-service-group',
            topics: ['restaurant-service-topic'],
            fromBeginning: false
        };

        this.kafkaRepository = new KafkaRepository<IRestaurant, any>(kafkaConfig, this.ProcessMessage);
        this.kafkaRepository.initialize();
    }

    private async ProcessMessage(pMessage: IMessage)
    {
        if (pMessage.eventType == EEventType.USER_DELETED && pMessage)
        {
            // Récupérer tous les restaurants liés à cet utilisateur
            const restaurantCritereDTO = { owner_id: pMessage.payload } as Partial<IRestaurant>;
            const restaurants = await this.getItems(restaurantCritereDTO);

            // Mettre à jour chaque restaurant
            for (const restaurant of restaurants)
            {
                // Modifier les propriétés selon vos besoins métier
                restaurant.status = 'closed';
                restaurant.updated_at = new Date();

                // Appliquer la mise à jour
                const restaurantCritere = { id: restaurant.id };
                await this.updateItem(restaurant, restaurantCritere);

                console.log(`Restaurant ${restaurant.id} mis à jour suite à la suppression de l'utilisateur ${pMessage.payload}`);
            }

            console.log(`${restaurants.length} restaurant(s) mis à jour suite à la suppression de l'utilisateur ${pMessage.payload}`);
        }
    }
}
