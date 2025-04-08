import { Kafka, Producer } from 'kafkajs';
import { IKafkaMessage } from './interfaces/IKafkaMessage';
import { IProducerConfig } from './interfaces/IProducerConfig';


export class KafkaProducer
{
    private producer: Producer;
    private connected: boolean = false;

    constructor (
        private readonly kafka: Kafka,
        private readonly config: IProducerConfig = {
            allowAutoTopicCreation: true,
            idempotent: true
        }
    )
    {
        this.producer = this.kafka.producer({
            allowAutoTopicCreation: config.allowAutoTopicCreation,
            idempotent: config.idempotent
        });
    }

    /**
     * Connexion au broker Kafka
     */
    async connect(): Promise<void>
    {
        if (!this.connected)
        {

            await this.producer.connect();
            this.connected = true;
            console.log('Producteur Kafka connect�');
        }
    }

    /**
     * D�connexion du broker Kafka
     */
    async disconnect(): Promise<void>
    {
        if (this.connected)
        {
            await this.producer.disconnect();
            this.connected = false;
            console.log('Producteur Kafka d�connect�');
        }
    }

    /**
     * Envoie un message � un topic
     */
    async send<T>(topic: string, message: IKafkaMessage<T>): Promise<void>
    {
        if (!this.connected)
        {
            await this.connect();
        }

        const value = typeof message.value === 'string'
            ? message.value
            : JSON.stringify(message.value);

        await this.producer.send({
            topic,
            messages: [
                {
                    key: message.key,
                    value,
                    headers: message.headers as any
                }
            ]
        });

        console.log(`Message envoy� au topic: ${topic}`);
    }
}