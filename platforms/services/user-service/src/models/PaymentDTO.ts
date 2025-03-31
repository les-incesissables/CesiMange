import { Entity, Column, PrimaryColumn, ObjectLiteral, PrimaryGeneratedColumn } from "typeorm";

/**
 * Entit� TypeORM pour la table SQL Server Payments
 * @author Entity Generator - 2025-03-31T18:35:05.937Z - Creation
 */
@Entity("Payments")
export class Payment
{
    /**
     * paymentId
     */
    @PrimaryGeneratedColumn()
    paymentId: number | undefined;

    /**
     * orderId
     */
    @Column()
    orderId: number | undefined;

    /**
     * paymentMethod
     * @maxLength 50
     */
    @Column({ length: 50, nullable: false })
    paymentMethod: string | undefined;

    /**
     * paymentStatus
     * @maxLength 50
     */
    @Column({ length: 50 })
    paymentStatus: string | undefined;

    /**
     * transactionId
     * @maxLength 100
     */
    @Column({ length: 100 })
    transactionId: string | undefined;

    /**
     * amount
     */
    @Column({ nullable: false })
    amount: number | undefined;

    /**
     * paymentDate
     */
    @Column()
    paymentDate: Date | undefined;

}
