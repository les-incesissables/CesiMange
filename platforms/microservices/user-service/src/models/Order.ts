import { Entity, Column, PrimaryColumn, ObjectLiteral, PrimaryGeneratedColumn } from "typeorm";

/**
 * Entit� TypeORM pour la table SQL Server Orders
 * @author Entity Generator - 2025-03-31T21:09:06.037Z - Creation
 */
@Entity("Orders")
export class Order implements ObjectLiteral
{
    /**
     * orderId
     */
    @PrimaryGeneratedColumn()
    orderId!: number;

    /**
     * customerId
     */
    @Column()
    customerId!: number;

    /**
     * restaurantId
     */
    @Column()
    restaurantId!: number;

    /**
     * driverId
     */
    @Column()
    driverId!: number;

    /**
     * addressId
     */
    @Column()
    addressId!: number;

    /**
     * orderStatus
     * @maxLength 50
     */
    @Column({ length: 50 })
    orderStatus!: string;

    /**
     * orderDate
     */
    @Column()
    orderDate!: Date;

    /**
     * estimatedDeliveryTime
     */
    @Column()
    estimatedDeliveryTime!: Date;

    /**
     * actualDeliveryTime
     */
    @Column()
    actualDeliveryTime!: Date;

    /**
     * subTotal
     */
    @Column()
    subTotal!: number;

    /**
     * deliveryFee
     */
    @Column()
    deliveryFee!: number;

    /**
     * tax
     */
    @Column()
    tax!: number;

    /**
     * totalAmount
     */
    @Column()
    totalAmount!: number;

    /**
     * specialInstructions
     * @maxLength 2147483647
     */
    @Column()
    specialInstructions!: string;

}
