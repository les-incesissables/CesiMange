import { Kafka, Consumer, Producer, EachMessagePayload, KafkaConfig } from 'kafkajs';
import { AbstractDbRepository } from './AbstractDbRepository';
import { IRepositoryConfig } from '../../interfaces/IRepositoryConfig';
import { IMessage } from "../../../../../services/base-classes/src/interfaces/IMessage";


/**
 * Repository générique pour Kafka
 * @template DTO - Type de données retourné/manipulé qui étend BaseDTO
 * @template Critere - Type des critères de recherche qui étend BaseCritereDTO
 * @author Votre Nom - CESIMANGE-XXX - Date - Implémentation pour Kafka
 */
export class KafkaRepository<DTO, Critere> extends AbstractDbRepository<DTO, Critere>
{
    //#region Attributes
    private kafka: Kafka | undefined;
    private kafkaTopics: string[];
    private cachedMessages: Map<string, DTO[]> = new Map();
    private isConnected: boolean = false;
    private _ProcessMessage: Function;
    //#endregion

    //#region Properties

    public Consumer: Consumer | undefined;
    public Producer: Producer | undefined;

    //#endregion

    //#region CTOR
    /**
    * Constructeur du repository Kafka
    * @param pKafkaConfig Configuration Kafka
    */
    constructor (pKafkaConfig: IRepositoryConfig, pProcessMessage: Function)
    {
        super(pKafkaConfig);
        this._ProcessMessage = pProcessMessage;
        this.kafkaTopics = pKafkaConfig.topics;
    }
    //#endregion

    /**
     * Initialise le repository Kafka
     */
    public async initialize(): Promise<void>
    {
        await this.initializeKafka(this._ProcessMessage);
    }

    /**
     * Ferme les connexions Kafka
     */
    async disconnect(): Promise<void>
    {
        await this.dispose();
    }

    /**
     * Initialise la connexion Kafka et commence à consommer les messages
     */
    private async initializeKafka(pProcessMessage: Function): Promise<void>
    {
        try
        {
            if (this.isConnected)
            {
                return; // Déjà connecté
            }

            this.kafka = new Kafka(this._config as KafkaConfig);
            this.Consumer = this.kafka.consumer({ groupId: this._config.groupId });
            this.Producer = this.kafka.producer();

            await this.CreateTopics(this.kafka);

            await this.ConnectKafka(pProcessMessage);

        } catch (error: any)
        {
            this.isConnected = false;
            console.error(`Erreur détaillée lors de l'initialisation de Kafka:`, error);
            throw new Error(`Erreur lors de l'initialisation de Kafka: ${error.message}`);
        }
    }

    private async CreateTopics(pKafka: Kafka)
    {
        // Créer l'admin client pour gérer les topics
        const admin = pKafka.admin();
        await admin.connect();

        // Récupérer la liste des topics existants
        const existingTopics = await admin.listTopics();

        // Vérifier et créer les topics manquants
        const topicsToCreate = this.kafkaTopics.filter(topic => !existingTopics.includes(topic));

        if (topicsToCreate.length > 0)
        {
            console.log(`Création des topics manquants: ${topicsToCreate.join(', ')}`);

            await admin.createTopics({
                topics: topicsToCreate.map(topic => ({
                    topic,
                    numPartitions: 3,      // Nombre de partitions
                    replicationFactor: 1   // Facteur de réplication (1 pour un environnement local/dev)
                })),
                timeout: 10000             // 10 secondes de timeout
            });

            console.log(`Topics créés avec succès: ${topicsToCreate.join(', ')}`);
        }

        // Déconnexion de l'admin après création des topics
        await admin.disconnect();
    }

    private async ConnectKafka(pProcessMessage: Function)
    {
        // Connexion à Kafka
        if (this.Consumer && this.Producer)
        {
            await this.Consumer.connect();
            await this.Producer.connect();

            // S'abonner aux topics
            for (const topic of this.kafkaTopics)
            {
                await this.Consumer.subscribe({
                    topic,
                    fromBeginning: this._config.fromBeginning || false
                });
            }

            // Démarrer la consommation des messages
            await this.startConsumingMessages(pProcessMessage);
            this.isConnected = true;
            console.log(`Connexion Kafka établie et abonnement aux topics: ${this.kafkaTopics.join(', ')}`);
        } else
        {
            throw new Error('Échec de l\'initialisation du consumer ou producer Kafka');
        }
    }

    /**
     * Configure le consommateur pour traiter les messages entrants
     */
    private async startConsumingMessages(pProcessMessage: Function): Promise<void>
    {
        if (!this.Consumer)
        {
            throw new Error('Consumer Kafka non initialisé');
        }

        await this.Consumer.run({
            eachMessage: async (payload: EachMessagePayload) =>
            {
                await this.handleMessage(payload, pProcessMessage);
            }
        });
    }

    /**
     * Traite un message Kafka entrant
     * @param payload Payload du message
     */
    private async handleMessage({ topic, partition, message }: EachMessagePayload, pProcessMessage: Function): Promise<void>
    {
        try
        {
            if (!message.value) return;

            const lMessageData = JSON.parse(message.value.toString()) as IMessage;

            // cm - Execute une action avec le message reçu
            await pProcessMessage(lMessageData);

        } catch (error: any)
        {
            console.error(`Erreur lors du traitement du message Kafka (topic ${topic}):`, error);
        }
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
                await this.initializeKafka(this._ProcessMessage);
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
                await this.initializeKafka(this._ProcessMessage);
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
                await this.initializeKafka(this._ProcessMessage);
            }

            if (!this.Producer)
            {
                throw new Error('Producer Kafka non initialisé');
            }

            // Déterminer le topic approprié
            const topic = this.determineTopicForMessage(pDTO);

            // Publier le message
            await this.Producer.send({
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
                await this.initializeKafka(this._ProcessMessage);
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
                await this.initializeKafka(this._ProcessMessage);
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
                await this.initializeKafka(this._ProcessMessage);
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

            if (this.Consumer)
            {
                await this.Consumer.disconnect();
            }

            if (this.Producer)
            {
                await this.Producer.disconnect();
            }

            this.isConnected = false;
            console.log('Connexions Kafka fermées');
        } catch (error: any)
        {
            console.error('Erreur lors de la fermeture des connexions Kafka:', error);
        }
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
    //#endregion
}