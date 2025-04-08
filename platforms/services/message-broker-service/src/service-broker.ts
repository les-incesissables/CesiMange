import { Kafka, KafkaConfig } from 'kafkajs';
import { IKafkaMessage } from "./interfaces/IKafkaMessage";
import { KafkaClient } from "./kafka-client";
import { IRequestHandler } from "./interfaces/IRequestHandler";
import { EEventType } from "./enums/EEventType";

/**
 * Service Broker pour la communication entre microservices
 */
export class ServiceBroker
{
    private _ServiceName: string;
    private _Client: KafkaClient;
    private readonly _kafka: Kafka;

    constructor (pConfig: KafkaConfig)
    {
        this._ServiceName = pConfig.clientId || '';
        this._Client = new KafkaClient(pConfig);
        this._kafka = new Kafka(pConfig);
    }

    /**
     * Cr�e un topic Kafka s'il n'existe pas d�j�
     * @param topic Nom du topic
     */
    private async createTopicIfNotExist(topic: string): Promise<void>
    {
        const admin = this._kafka.admin();
        try
        {
            await admin.connect();
            const topics = await admin.listTopics();

            if (!topics.includes(topic))
            {
                console.log(`Le topic '${topic}' n'existe pas, cr�ation en cours...`);
                await admin.createTopics({
                    topics: [{
                        topic,
                        numPartitions: 1, // Nombre de partitions
                        replicationFactor: 1 // Facteur de r�plication
                    }],
                });
                console.log(`Le topic '${topic}' a �t� cr�� avec succ�s.`);
            } else
            {
                console.log(`Le topic '${topic}' existe d�j�.`);
            }
        } catch (error)
        {
            console.error(`Erreur lors de la v�rification/cr�ation du topic '${topic}':`, error);
            throw error; // Relancer l'erreur pour signaler l'�chec
        } finally
        {
            await admin.disconnect();
        }
    }

    /**
     * G�n�re le nom du topic en suivant la convention
     * @param eventType Type de l'�v�nement
     * @returns Nom du topic
     */
    private generateTopicName(eventType: EEventType): string
    {
        return `${eventType.toLowerCase().replace(/\./g, '-')}-events`;
    }

    /**
     * Publie un �v�nement sur un topic
     * @param eventType Type de l'�v�nement (EEventType)
     * @param data Donn�es � publier
     * @param correlationId ID de corr�lation
     */
    async publishEvent<T>(eventType: EEventType, data: T, correlationId?: string): Promise<void>
    {
        const topic = this.generateTopicName(eventType);

        try
        {
            // Assurer que le topic existe
            await this.createTopicIfNotExist(topic);

            const producer = this._Client.producer;

            const message: IKafkaMessage = {
                value: {
                    type: eventType,
                    data,
                    timestamp: new Date().toISOString()
                },
                headers: {
                    source: this._ServiceName,
                    eventType,
                    correlationId: correlationId || this.generateId(),
                    timestamp: Date.now().toString()
                }
            };

            await producer.send(topic, message);
        } catch (error)
        {
            console.error(`Erreur lors de la publication de l'�v�nement ${eventType} sur le topic ${topic}:`, error);
            throw error;
        }
    }

    /**
     * S'abonne � un type d'�v�nement
     * @param eventType Type de l'�v�nement (EEventType)
     * @param handler Fonction de traitement
     * @param groupId ID du groupe
     */
    async subscribeToEvent<T>(
        eventType: EEventType,
        handler: (data: T, headers: Record<string, string>) => Promise<void>,
        groupId?: string
    ): Promise<void>
    {
        const topic = this.generateTopicName(eventType);

        try
        {
            // Assurer que le topic existe
            await this.createTopicIfNotExist(topic);

            const consumer = this._Client.createConsumer(
                groupId || `${this._ServiceName}-${eventType.toLowerCase()}-group`
            );

            await consumer.subscribe(topic, async (message: IKafkaMessage) =>
            {
                if (message.value && message.value.type === eventType)
                {
                    await handler(message.value.data, message.headers || {});
                }
            });
        } catch (error)
        {
            console.error(`Erreur lors de l'abonnement � l'�v�nement ${eventType} sur le topic ${topic}:`, error);
            throw error;
        }
    }

    /**
     * Demande des donn�es � un autre service (pattern request-reply)
     */
    async request<TRequest, TResponse>(
        service: string,
        action: string,
        data: TRequest,
        timeout: number = 30000
    ): Promise<TResponse>
    {
        return new Promise(async (resolve, reject) =>
        {
            const correlationId = this.generateId();
            const requestTopic = `${service}.requests`;
            const replyTopic = `${this._ServiceName}.replies`;

            // Timeout
            const timeoutId = setTimeout(() =>
            {
                reject(new Error(`Timeout apr�s ${timeout}ms pour la requ�te ${action}`));
            }, timeout);

            // �couter la r�ponse
            const consumer = this._Client.createConsumer(`${this._ServiceName}-request-${correlationId}`);
            await consumer.subscribe(replyTopic, async (message: IKafkaMessage) =>
            {
                if (message.headers?.correlationId === correlationId)
                {
                    clearTimeout(timeoutId);
                    await consumer.disconnect();
                    resolve(message.value?.data);
                }
            });

            // Envoyer la requ�te
            const producer = this._Client.producer;
            await producer.send(requestTopic, {
                value: {
                    action,
                    data,
                    timestamp: new Date().toISOString()
                },
                headers: {
                    source: this._ServiceName,
                    action,
                    correlationId,
                    replyTo: replyTopic,
                    timestamp: Date.now().toString()
                }
            });
        });
    }

    /**
     * Traite les requ�tes entrantes
     */
    async handleRequests(
        handlers: Record<string, IRequestHandler>
    ): Promise<void>
    {
        const requestTopic = `${this._ServiceName}.requests`;
        const consumer = this._Client.createConsumer(`${this._ServiceName}-request-handler`);

        await consumer.subscribe(requestTopic, async (message: IKafkaMessage) =>
        {
            const action = message.value?.action || message.headers?.action;
            const handler = handlers[action];

            if (handler)
            {
                try
                {
                    // Ex�cuter le handler
                    const result = await handler(message.value?.data, message.headers || {});

                    // Envoyer la r�ponse si replyTo existe
                    if (message.headers?.replyTo)
                    {
                        const producer = this._Client.producer;
                        await producer.send(message.headers.replyTo, {
                            value: {
                                data: result,
                                timestamp: new Date().toISOString()
                            },
                            headers: {
                                source: this._ServiceName,
                                correlationId: message.headers.correlationId,
                                timestamp: Date.now().toString()
                            }
                        });
                    }
                } catch (error: any)
                {
                    console.error(`Erreur lors du traitement de l'action ${action}:`, error);

                    // Envoyer l'erreur en r�ponse
                    if (message.headers?.replyTo)
                    {
                        const producer = this._Client.producer;
                        await producer.send(message.headers.replyTo, {
                            value: {
                                error: {
                                    message: error.message,
                                    stack: error.stack
                                },
                                timestamp: new Date().toISOString()
                            },
                            headers: {
                                source: this._ServiceName,
                                correlationId: message.headers.correlationId,
                                error: 'true',
                                timestamp: Date.now().toString()
                            }
                        });
                    }
                }
            } else
            {
                console.warn(`Pas de handler trouv� pour l'action: ${action}`);
            }
        });
    }

    /**
     * G�n�re un ID unique
     */
    private generateId(): string
    {
        return Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
    }

    /**
     * Ferme toutes les connexions
     */
    async close(): Promise<void>
    {
        await this._Client.producer.disconnect();
        console.log('ServiceBroker ferm�');
    }
}
