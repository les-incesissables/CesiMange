import { ObjectLiteral } from "typeorm";
/**
 * CritereDTO pour la recherche d'entit�s SQL Server Order
 * @author DTO Generator - 2025-03-31T21:09:06.038Z - Creation
 */
export class OrderCritereDTO implements ObjectLiteral
{
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
     * Crit�re de recherche pour addressId
     */
    addressId?: number | undefined;

    /**
     * Crit�re de recherche pour orderStatus
     */
    orderStatus?: string | undefined;

    /**
     * Recherche avec LIKE pour orderStatus
     */
    orderStatusLike?: string | undefined;

    /**
     * Crit�re de recherche pour orderDate
     */
    orderDate?: Date | undefined;

    /**
     * Valeur minimale pour orderDate
     */
    orderDateMin?: Date | undefined;

    /**
     * Valeur maximale pour orderDate
     */
    orderDateMax?: Date | undefined;

    /**
     * Crit�re de recherche pour estimatedDeliveryTime
     */
    estimatedDeliveryTime?: Date | undefined;

    /**
     * Valeur minimale pour estimatedDeliveryTime
     */
    estimatedDeliveryTimeMin?: Date | undefined;

    /**
     * Valeur maximale pour estimatedDeliveryTime
     */
    estimatedDeliveryTimeMax?: Date | undefined;

    /**
     * Crit�re de recherche pour actualDeliveryTime
     */
    actualDeliveryTime?: Date | undefined;

    /**
     * Valeur minimale pour actualDeliveryTime
     */
    actualDeliveryTimeMin?: Date | undefined;

    /**
     * Valeur maximale pour actualDeliveryTime
     */
    actualDeliveryTimeMax?: Date | undefined;

    /**
     * Crit�re de recherche pour subTotal
     */
    subTotal?: number | undefined;

    /**
     * Valeur minimale pour subTotal
     */
    subTotalMin?: number | undefined;

    /**
     * Valeur maximale pour subTotal
     */
    subTotalMax?: number | undefined;

    /**
     * Crit�re de recherche pour deliveryFee
     */
    deliveryFee?: number | undefined;

    /**
     * Valeur minimale pour deliveryFee
     */
    deliveryFeeMin?: number | undefined;

    /**
     * Valeur maximale pour deliveryFee
     */
    deliveryFeeMax?: number | undefined;

    /**
     * Crit�re de recherche pour tax
     */
    tax?: number | undefined;

    /**
     * Valeur minimale pour tax
     */
    taxMin?: number | undefined;

    /**
     * Valeur maximale pour tax
     */
    taxMax?: number | undefined;

    /**
     * Crit�re de recherche pour totalAmount
     */
    totalAmount?: number | undefined;

    /**
     * Valeur minimale pour totalAmount
     */
    totalAmountMin?: number | undefined;

    /**
     * Valeur maximale pour totalAmount
     */
    totalAmountMax?: number | undefined;

    /**
     * Crit�re de recherche pour specialInstructions
     */
    specialInstructions?: string | undefined;

    /**
     * Recherche avec LIKE pour specialInstructions
     */
    specialInstructionsLike?: string | undefined;

}
