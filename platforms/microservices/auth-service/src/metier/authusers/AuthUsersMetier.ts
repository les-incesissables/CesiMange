import { AuthUsers } from "../../models/entities/authusers/AuthUsers";
import { AuthUsersCritereDTO } from "../../models/entities/authusers/AuthUsersCritereDTO";
import { BaseMetier } from "../../../../../services/base-classes/src/metier/base/BaseMetier";
import { EDatabaseType, IRepositoryConfig } from "../../../../../services/data-access-layer/src";
import { KafkaRepository } from "../../../../../services/data-access-layer/src/repositories/base/KafkaRepository";
import { EachMessagePayload } from 'kafkajs';
import { IMessage } from "../../../../../services/base-classes/src/interfaces/IMessage";
import { EEventType } from "../../../../../services/base-classes/src/enums/EEventType";


/**
 * Métier pour l'entité AuthUsers
 * @author Metier Generator - 2025-04-02T16:35:50.229Z - Creation
 */
export class AuthUsersMetier extends BaseMetier<AuthUsers, AuthUsersCritereDTO>
{
    private _topic: string;
    private kafkaRepository: KafkaRepository<any, any>;

    constructor ()
    {
        super('AuthUsers', AuthUsers);
        this._topic = 'restaurant-service-topic';
        // Configuration du repository Kafka pour les événements utilisateurs
        const kafkaConfig: IRepositoryConfig = {
            CollectionName: '',
            ConnectionString: '',
            DbName: '',
            TypeBDD: EDatabaseType.KAFKA,
            clientId: 'auth-users-service',
            brokers: ['localhost:9092'], // Ajustez selon votre configuration
            groupId: 'restaurant-service-group',
            topics: [this._topic],
            fromBeginning: false
        };

        this.kafkaRepository = new KafkaRepository(kafkaConfig, this.ProcessMessage);
        this.kafkaRepository.initialize();
    }

    private ProcessMessage(payload: EachMessagePayload)
    {
        console.log('nicepayload :', payload);
    }

    /**
     * Méthode appelée après la suppression d'un utilisateur
     * Publie un événement sur Kafka pour informer les autres services
     * @param item Utilisateur supprimé
     */
    override async afterDeleteItem(item: AuthUsers): Promise<void>
    {
        try
        {
            // Créer l'événement utilisateur pour Kafka
            const lMessage: IMessage = {
                eventType: EEventType.USER_DELETED,
                topic: this._topic,
                payload: item.auth_user_id
            };

            // Publier l'événement sur Kafka
            await this.kafkaRepository.createItem(lMessage);

            console.log(`Événement de suppression utilisateur publié pour userId: ${item.auth_user_id} topic : ${this._topic} `);
        } catch (error)
        {
            console.error('Échec de la publication de l\'événement de suppression utilisateur:', error);
            // Selon votre stratégie, vous pourriez vouloir relancer l'erreur ou simplement la logger
        }
    }
}