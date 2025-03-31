import { Entity, Column, PrimaryColumn, ObjectLiteral, PrimaryGeneratedColumn } from "typeorm";

/**
 * Entit� TypeORM pour la table SQL Server Reviews
 * @author Entity Generator - 2025-03-31T18:35:05.945Z - Creation
 */
@Entity("Reviews")
export class Review
{
    /**
     * reviewId
     */
    @PrimaryGeneratedColumn()
    reviewId: number | undefined;

    /**
     * orderId
     */
    @Column()
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
     * rating
     */
    @Column()
    rating: number | undefined;

    /**
     * comment
     * @maxLength 2147483647
     */
    @Column()
    comment: string | undefined;

    /**
     * reviewDate
     */
    @Column()
    reviewDate: Date | undefined;

}
