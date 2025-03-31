import { Entity, Column, PrimaryColumn, ObjectLiteral, PrimaryGeneratedColumn } from "typeorm";

/**
 * Entit� TypeORM pour la table SQL Server Reviews
 * @author Entity Generator - 2025-03-31T21:09:06.052Z - Creation
 */
@Entity("Reviews")
export class Review implements ObjectLiteral
{
    /**
     * reviewId
     */
    @PrimaryGeneratedColumn()
    reviewId!: number;

    /**
     * orderId
     */
    @Column()
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
     * rating
     */
    @Column()
    rating!: number;

    /**
     * comment
     * @maxLength 2147483647
     */
    @Column()
    comment!: string;

    /**
     * reviewDate
     */
    @Column()
    reviewDate!: Date;

}
