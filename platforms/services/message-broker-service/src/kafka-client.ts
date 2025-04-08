import { Kafka, KafkaConfig } from 'kafkajs';
import { KafkaProducer } from './kafka-producer';
import { KafkaConsumer } from './kafka-consumer';

export class KafkaClient
{
    private kafka: Kafka;
    private _producer?: KafkaProducer;

    constructor (private readonly pConfig: KafkaConfig)
    {
        this.kafka = new Kafka(pConfig);

        console.log(`KafkaClient initialis� avec brokers: ${pConfig.brokers}`);
    }

    /**
     * R�cup�re ou cr�e une instance du producteur
     */
    get producer(): KafkaProducer
    {
        if (!this._producer)
        {
            this._producer = new KafkaProducer(this.kafka);
        }
        return this._producer;
    }

    /**
     * Cr�e un consommateur avec un ID de groupe
     */
    createConsumer(groupId: string): KafkaConsumer
    {
        return new KafkaConsumer(this.kafka, groupId);
    }
}