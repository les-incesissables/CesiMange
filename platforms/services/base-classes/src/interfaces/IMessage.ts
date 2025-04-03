import { EEventType } from "../enums/EEventType";

/**
 * Interface de message pour le message broker
 * @author Mahmoud Charif - CESIMANGE-118 - 17/03/2025 - Adaptation aux normes
 */
export interface IMessage
{
    //#region Properties

    /**
     * Type d'evenement
     */
    eventType: EEventType;
    /**
     * Contenu du message
     */
    payload?: any;
    /**
     * topic du message
     */
    topic: string;
}