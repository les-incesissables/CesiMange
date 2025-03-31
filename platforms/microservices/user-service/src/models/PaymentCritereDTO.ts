import { ObjectLiteral } from "typeorm";
/**
 * CritereDTO pour la recherche d'entit�s SQL Server Payment
 * @author DTO Generator - 2025-03-31T21:09:06.046Z - Creation
 */
export class PaymentCritereDTO implements ObjectLiteral
{
    /**
     * Crit�re de recherche pour paymentId
     */
    paymentId?: number | undefined;

    /**
     * Crit�re de recherche pour orderId
     */
    orderId?: number | undefined;

    /**
     * Crit�re de recherche pour paymentMethod
     */
    paymentMethod?: string | undefined;

    /**
     * Recherche avec LIKE pour paymentMethod
     */
    paymentMethodLike?: string | undefined;

    /**
     * Crit�re de recherche pour paymentStatus
     */
    paymentStatus?: string | undefined;

    /**
     * Recherche avec LIKE pour paymentStatus
     */
    paymentStatusLike?: string | undefined;

    /**
     * Crit�re de recherche pour transactionId
     */
    transactionId?: string | undefined;

    /**
     * Recherche avec LIKE pour transactionId
     */
    transactionIdLike?: string | undefined;

    /**
     * Crit�re de recherche pour amount
     */
    amount?: number | undefined;

    /**
     * Valeur minimale pour amount
     */
    amountMin?: number | undefined;

    /**
     * Valeur maximale pour amount
     */
    amountMax?: number | undefined;

    /**
     * Crit�re de recherche pour paymentDate
     */
    paymentDate?: Date | undefined;

    /**
     * Valeur minimale pour paymentDate
     */
    paymentDateMin?: Date | undefined;

    /**
     * Valeur maximale pour paymentDate
     */
    paymentDateMax?: Date | undefined;

}
