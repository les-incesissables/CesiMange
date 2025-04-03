import { Kafka, Consumer, Producer, EachMessagePayload, KafkaConfig } from 'kafkajs';
import { AbstractDbRepository } from './AbstractDbRepository';
import { IRepositoryConfig } from '../../interfaces/IRepositoryConfig';


/**
 * Repository générique pour Kafka
 * @template DTO - Type de données retourné/manipulé qui étend BaseDTO
 * @template Critere - Type des critères de recherche qui étend BaseCritereDTO
 * @author Votre Nom - CESIMANGE-XXX - Date - Implémentation pour Kafka
 */
export class KafkaRepository<DTO, Critere> extends AbstractDbRepository<DTO, Critere>
{
    private kafka: Kafka | undefined;
    private consumer: Consumer | undefined;
    private producer: Producer | undefined;
    private kafkaTopics: string[];
    private cachedMessages: Map<string, DTO[]> = new Map();
    private isConnected: boolean = false;

    /**
     * Constructeur du repository Kafka
     * @param pKafkaConfig Configuration Kafka
     */
    constructor (pKafkaConfig: IRepositoryConfig)
    {
        super(pKafkaConfig);

        this.kafkaTopics = pKafkaConfig.topics;
    }

    /**
     * Initialise le repository Kafka
     */
    public async initialize(): Promise<void>
    {
        await this.initializeKafka();
    }

    /**
     * Ferme les connexions Kafka
     */
    async disconnect(): Promise<void>
    {
        await this.dispose();
    }

    /**
     * Construit un filtre à partir des critères
     * @param pCritereDTO Critères de filtrage
     * @returns Filtre formaté (non utilisé pour Kafka)
     */
    buildFilter(pCritereDTO: Critere): any
    {
        // Non utilisé pour Kafka, mais requis par l'interface
        return pCritereDTO;
    }

    /**
     * Formate les résultats
     * @param pResults Résultats à formater
     * @returns Résultats formatés
     */
    formatResults(pResults: any[] | any): DTO[]
    {
        // Pour Kafka, les résultats sont déjà formatés
        if (Array.isArray(pResults))
        {
            return pResults as DTO[];
        }
        return pResults ? [pResults as DTO] : [];
    }

    /**
     * Initialise la connexion Kafka et commence à consommer les messages
     */
    private async initializeKafka(): Promise<void>
    {
        try
        {
            if (this.isConnected)
            {
                return; // Déjà connecté
            }

            this.kafka = new Kafka(this._config as KafkaConfig);

            this.consumer = this.kafka.consumer({ groupId: this._config.groupId });

            this.producer = this.kafka.producer();

            // Connexion à Kafka
            if (this.consumer && this.producer)
            {
                await this.consumer.connect();
                await this.producer.connect();

                // S'abonner aux topics
                for (const topic of this.kafkaTopics)
                {
                    await this.consumer.subscribe({
                        topic,
                        fromBeginning: this._config.fromBeginning || false
                    });
                }

                // Démarrer la consommation des messages
                await this.startConsumingMessages();

                this.isConnected = true;
            } else
            {
                throw new Error('Échec de l\'initialisation du consumer ou producer Kafka');
            }
        } catch (error: any)
        {
            this.isConnected = false;
            throw new Error(`Erreur lors de l'initialisation de Kafka: ${error.message}`);
        }
    }

    /**
     * Configure le consommateur pour traiter les messages entrants
     */
    private async startConsumingMessages(): Promise<void>
    {
        if (!this.consumer)
        {
            throw new Error('Consumer Kafka non initialisé');
        }

        await this.consumer.run({
            eachMessage: async (payload: EachMessagePayload) =>
            {
                await this.handleMessage(payload);
            }
        });
    }

    /**
     * Traite un message Kafka entrant
     * @param payload Payload du message
     */
    private async handleMessage({ topic, partition, message }: EachMessagePayload): Promise<void>
    {
        try
        {
            if (!message.value) return;

            const messageData = JSON.parse(message.value.toString()) as DTO;

            // Ajouter le message au cache par topic
            if (!this.cachedMessages.has(topic))
            {
                this.cachedMessages.set(topic, []);
            }

            const messages = this.cachedMessages.get(topic);
            if (!messages)
            {
                this.cachedMessages.set(topic, [messageData]);
                return;
            }

            // Vérifier si le message existe déjà (basé sur un identifiant)
            const messageId = this.getMessageIdentifier(messageData);
            const existingIndex = messages.findIndex(m => this.getMessageIdentifier(m) === messageId);

            if (existingIndex >= 0)
            {
                // Mettre à jour le message existant
                messages[existingIndex] = messageData;
            } else
            {
                // Ajouter le nouveau message
                messages.push(messageData);
            }

            // Limiter la taille du cache (optionnel)
            if (messages.length > 1000)
            {
                messages.shift(); // Supprimer le plus ancien message
            }

            this.cachedMessages.set(topic, messages);
        } catch (error: any)
        {
            console.error(`Erreur lors du traitement du message Kafka (topic ${topic}):`, error);
        }
    }

    /**
     * Extrait un identifiant unique du message
     * @param message Message à identifier
     * @returns Identifiant unique du message
     */
    private getMessageIdentifier(message: DTO): string
    {
        // Hypothèse: l'objet a une propriété 'id'
        return (message as any).id || JSON.stringify(message);
    }

    /**
     * Obtient la clé de message pour le partitionnement Kafka
     * @param pDTO Message à publier
     * @returns Clé pour le partitionnement
     */
    private getMessageKey(pDTO: DTO): string
    {
        // Important pour garantir l'ordre des messages liés
        return (pDTO as any).id || '';
    }

    /**
     * Détermine le topic approprié pour un message
     * @param pDTO Message à publier
     * @returns Nom du topic
     */
    private determineTopicForMessage(pDTO: DTO): string
    {
        // Vérifier que des topics sont configurés
        if (this.kafkaTopics.length === 0)
        {
            throw new Error('Aucun topic configuré pour KafkaRepository');
        }

        // Détermination du topic selon le type de message
        const messageType = (pDTO as any).messageType;

        if (messageType === 'commande' && this.kafkaTopics.includes('commandes'))
        {
            return 'commandes';
        }
        if (messageType === 'preparation' && this.kafkaTopics.includes('preparation'))
        {
            return 'preparation';
        }
        if (messageType === 'livraison' && this.kafkaTopics.includes('livraison'))
        {
            return 'livraison';
        }

        // Topic par défaut
        return this.kafkaTopics[0];
    }

    /**
     * Détermine quels topics utiliser en fonction des critères
     * @param pCritere Critères de recherche
     * @returns Liste des topics à utiliser
     */
    private determineTopicsFromCriteria(pCritere: Critere): string[]
    {
        // Si aucun critère, utiliser tous les topics
        if (!pCritere || Object.keys(pCritere as object).length === 0)
        {
            return this.kafkaTopics;
        }

        // Détermination des topics selon le type de message
        const messageType = (pCritere as any).messageType;

        if (messageType === 'commande' && this.kafkaTopics.includes('commandes'))
        {
            return ['commandes'];
        }
        if (messageType === 'preparation' && this.kafkaTopics.includes('preparation'))
        {
            return ['preparation'];
        }
        if (messageType === 'livraison' && this.kafkaTopics.includes('livraison'))
        {
            return ['livraison'];
        }

        // Par défaut, tous les topics
        return this.kafkaTopics;
    }

    /**
     * Filtre les messages en fonction des critères
     * @param messages Liste de messages à filtrer
     * @param pCritere Critères de filtrage
     * @returns Messages filtrés
     */
    private filterMessagesByCriteria(messages: DTO[], pCritere: Critere): DTO[]
    {
        if (!pCritere || Object.keys(pCritere as object).length === 0)
        {
            return messages;
        }

        return messages.filter(message =>
        {
            // Parcourir tous les critères et vérifier si le message correspond
            for (const [key, value] of Object.entries(pCritere as object))
            {
                // Si la valeur du critère est définie et différente de celle du message
                if (value !== undefined && (message as any)[key] !== value)
                {
                    return false;
                }
            }
            return true;
        });
    }

    //#region Implémentation des méthodes AbstractDbRepository

    /**
     * Obtenir tous les éléments selon des critères
     * @param pCritere Critères de recherche
     * @returns Liste des éléments correspondants
     */
    async getItems(pCritere: Critere): Promise<DTO[]>
    {
        try
        {
            if (!this.isConnected)
            {
                await this.initializeKafka();
            }

            // Déterminer quels topics utiliser
            const topicsToUse = this.determineTopicsFromCriteria(pCritere);

            // Collecter tous les messages des topics pertinents
            let allMessages: DTO[] = [];
            for (const topic of topicsToUse)
            {
                const topicMessages = this.cachedMessages.get(topic) || [];
                allMessages = [...allMessages, ...topicMessages];
            }

            // Filtrer les messages selon les critères
            return this.filterMessagesByCriteria(allMessages, pCritere);
        } catch (error: any)
        {
            console.error('Erreur dans KafkaRepository.getItems:', error);
            throw error;
        }
    }

    /**
     * Obtenir un élément selon des critères
     * @param pCritere Critères de recherche
     * @returns Premier élément correspondant ou objet vide
     */
    async getItem(pCritere: Critere): Promise<DTO>
    {
        try
        {
            if (!this.isConnected)
            {
                await this.initializeKafka();
            }

            const items = await this.getItems(pCritere);
            return items.length > 0 ? items[0] : {} as DTO;
        } catch (error: any)
        {
            console.error('Erreur dans KafkaRepository.getItem:', error);
            throw error;
        }
    }

    /**
     * Créer un nouvel élément (publier un message Kafka)
     * @param pDTO Données à publier
     * @returns Données publiées
     */
    async createItem(pDTO: DTO): Promise<DTO>
    {
        try
        {
            if (!this.isConnected)
            {
                await this.initializeKafka();
            }

            if (!this.producer)
            {
                throw new Error('Producer Kafka non initialisé');
            }

            // Déterminer le topic approprié
            const topic = this.determineTopicForMessage(pDTO);

            // Publier le message
            await this.producer.send({
                topic,
                messages: [
                    {
                        value: JSON.stringify(pDTO),
                        key: this.getMessageKey(pDTO)
                    }
                ]
            });

            return pDTO;
        } catch (error: any)
        {
            console.error('Erreur dans KafkaRepository.createItem:', error);
            throw error;
        }
    }

    /**
     * Mettre à jour un élément existant (publier une mise à jour)
     * @param pDTO Données mises à jour
     * @param pCritere Critères pour identifier l'élément
     * @returns Données mises à jour
     */
    async updateItem(pDTO: DTO, pCritere: Critere): Promise<DTO>
    {
        try
        {
            if (!this.isConnected)
            {
                await this.initializeKafka();
            }

            // Pour Kafka, une mise à jour est simplement une nouvelle publication
            // avec quelques métadonnées supplémentaires
            (pDTO as any)._updatedAt = new Date();
            (pDTO as any)._updateOperation = true;

            return await this.createItem(pDTO);
        } catch (error: any)
        {
            console.error('Erreur dans KafkaRepository.updateItem:', error);
            throw error;
        }
    }

    /**
     * Supprimer un élément (publier un message de suppression)
     * @param pCritere Critères pour identifier l'élément
     * @returns Succès de l'opération
     */
    async deleteItem(pCritere: Critere): Promise<boolean>
    {
        try
        {
            if (!this.isConnected)
            {
                await this.initializeKafka();
            }

            // Obtenir l'élément à "supprimer"
            const item = await this.getItem(pCritere);
            if (item)
                return false; // Vérifier si l'objet est vide

            // Marquer comme supprimé
            (item as any).deleted = true;
            (item as any).deletedAt = new Date();
            (item as any)._deleteOperation = true;

            // Publier le message de suppression
            await this.createItem(item);
            return true;
        } catch (error: any)
        {
            console.error('Erreur dans KafkaRepository.deleteItem:', error);
            throw error;
        }
    }

    /**
     * Vérifier si un élément existe
     * @param pCritere Critères de recherche
     * @returns True si l'élément existe
     */
    async itemExists(pCritere: Critere): Promise<boolean>
    {
        try
        {
            if (!this.isConnected)
            {
                await this.initializeKafka();
            }

            const items = await this.getItems(pCritere);
            return items.length > 0;
        } catch (error: any)
        {
            console.error('Erreur dans KafkaRepository.itemExists:', error);
            throw error;
        }
    }

    /**
     * Nettoyer les ressources lors de la fermeture
     */
    async dispose(): Promise<void>
    {
        try
        {
            if (!this.isConnected)
            {
                return; // Déjà déconnecté
            }

            if (this.consumer)
            {
                await this.consumer.disconnect();
            }

            if (this.producer)
            {
                await this.producer.disconnect();
            }

            this.isConnected = false;
            console.log('Connexions Kafka fermées');
        } catch (error: any)
        {
            console.error('Erreur lors de la fermeture des connexions Kafka:', error);
        }
    }
    //#endregion
}