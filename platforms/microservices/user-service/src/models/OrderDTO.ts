import { Entity, Column, PrimaryColumn, ObjectLiteral, PrimaryGeneratedColumn } from "typeorm";

/**
 * Entit� TypeORM pour la table SQL Server Orders
 * @author Entity Generator - 2025-03-31T18:35:05.930Z - Creation
 */
@Entity("Orders")
export class Order
{
    /**
     * orderId
     */
    @PrimaryGeneratedColumn()
    orderId: number | undefined;

    /**
     * customerId
     */
    @Column()
    customerId: number | undefined;

    /**
     * restaurantId
     */
    @Column()
    restaurantId: number | undefined;

    /**
     * driverId
     */
    @Column()
    driverId: number | undefined;

    /**
     * addressId
     */
    @Column()
    addressId: number | undefined;

    /**
     * orderStatus
     * @maxLength 50
     */
    @Column({ length: 50 })
    orderStatus: string | undefined;

    /**
     * orderDate
     */
    @Column()
    orderDate: Date | undefined;

    /**
     * estimatedDeliveryTime
     */
    @Column()
    estimatedDeliveryTime: Date | undefined;

    /**
     * actualDeliveryTime
     */
    @Column()
    actualDeliveryTime: Date | undefined;

    /**
     * subTotal
     */
    @Column()
    subTotal: number | undefined;

    /**
     * deliveryFee
     */
    @Column()
    deliveryFee: number | undefined;

    /**
     * tax
     */
    @Column()
    tax: number | undefined;

    /**
     * totalAmount
     */
    @Column()
    totalAmount: number | undefined;

    /**
     * specialInstructions
     * @maxLength 2147483647
     */
    @Column()
    specialInstructions: string | undefined;

}
