import { KafkaConfig } from "kafkajs";
import { IKafkaMessage } from "./interfaces/IKafkaMessage";
import { KafkaClient} from "./kafka-client";


/**
 * Interface pour les handlers de requêtes
 */
export interface IRequestHandler
{
    (data: any, headers: Record<string, string>): Promise<any>;
}

/**
 * Service Broker pour la communication entre microservices
 */
export class ServiceBroker
{
    private _ServiceName: string;
    private _Client: KafkaClient;

    constructor (pServiceName: string, pConfig: KafkaConfig)
    {
        this._ServiceName = pServiceName;
        // Créer une copie pour ne pas modifier l'original
        const config = { ...pConfig, clientId: `${pServiceName}-client` };
        this._Client = new KafkaClient(config);
    }

    /**
     * Publie un événement sur un topic
     */
    async publishEvent<T>(eventType: string, data: T, correlationId?: string): Promise<void>
    {
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

        const topic = `${eventType.toLowerCase().replace(/\./g, '-')}-events`;

        await producer.send(topic, message);
    }

    /**
     * S'abonne à un type d'événement
     */
    async subscribeToEvent<T>(
        eventType: string,
        handler: (data: T, headers: Record<string, string>) => Promise<void>,
        groupId?: string
    ): Promise<void>
    {
        const topic = `${eventType.toLowerCase().replace(/\./g, '-')}-events`;
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
    }

    /**
     * Demande des données à un autre service (pattern request-reply)
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
                reject(new Error(`Timeout après ${timeout}ms pour la requête ${action}`));
            }, timeout);

            // Écouter la réponse
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

            // Envoyer la requête
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
     * Traite les requêtes entrantes
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
                    // Exécuter le handler
                    const result = await handler(message.value?.data, message.headers || {});

                    // Envoyer la réponse si replyTo existe
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

                    // Envoyer l'erreur en réponse
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
                console.warn(`Pas de handler trouvé pour l'action: ${action}`);
            }
        });
    }

    /**
     * Génère un ID unique
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
        console.log('ServiceBroker fermé');
    }
}