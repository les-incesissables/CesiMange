import { Entity, Column, PrimaryColumn, ObjectLiteral, PrimaryGeneratedColumn } from "typeorm";

/**
 * Entit� TypeORM pour la table SQL Server Payments
 * @author Entity Generator - 2025-03-31T21:09:06.045Z - Creation
 */
@Entity("Payments")
export class Payment implements ObjectLiteral
{
    /**
     * paymentId
     */
    @PrimaryGeneratedColumn()
    paymentId!: number;

    /**
     * orderId
     */
    @Column()
    orderId!: number;

    /**
     * paymentMethod
     * @maxLength 50
     */
    @Column({ length: 50, nullable: false })
    paymentMethod!: string;

    /**
     * paymentStatus
     * @maxLength 50
     */
    @Column({ length: 50 })
    paymentStatus!: string;

    /**
     * transactionId
     * @maxLength 100
     */
    @Column({ length: 100 })
    transactionId!: string;

    /**
     * amount
     */
    @Column({ nullable: false })
    amount!: number;

    /**
     * paymentDate
     */
    @Column()
    paymentDate!: Date;

}
