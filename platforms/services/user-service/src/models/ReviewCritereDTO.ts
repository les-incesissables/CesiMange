import { ObjectLiteral } from "typeorm";
/**
 * CritereDTO pour la recherche d'entit�s SQL Server Review
 * @author DTO Generator - 2025-03-31T21:09:06.053Z - Creation
 */
export class ReviewCritereDTO implements ObjectLiteral
{
    /**
     * Crit�re de recherche pour reviewId
     */
    reviewId?: number | undefined;

    /**
     * Crit�re de recherche pour orderId
     */
    orderId?: number | undefined;

    /**
     * Crit�re de recherche pour customerId
     */
    customerId?: number | undefined;

    /**
     * Crit�re de recherche pour restaurantId
     */
    restaurantId?: number | undefined;

    /**
     * Crit�re de recherche pour driverId
     */
    driverId?: number | undefined;

    /**
     * Crit�re de recherche pour rating
     */
    rating?: number | undefined;

    /**
     * Valeur minimale pour rating
     */
    ratingMin?: number | undefined;

    /**
     * Valeur maximale pour rating
     */
    ratingMax?: number | undefined;

    /**
     * Crit�re de recherche pour comment
     */
    comment?: string | undefined;

    /**
     * Recherche avec LIKE pour comment
     */
    commentLike?: string | undefined;

    /**
     * Crit�re de recherche pour reviewDate
     */
    reviewDate?: Date | undefined;

    /**
     * Valeur minimale pour reviewDate
     */
    reviewDateMin?: Date | undefined;

    /**
     * Valeur maximale pour reviewDate
     */
    reviewDateMax?: Date | undefined;

}
