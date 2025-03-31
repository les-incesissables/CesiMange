import { Entity, Column, PrimaryColumn, ObjectLiteral, PrimaryGeneratedColumn } from "typeorm";

/**
 * Entit� TypeORM pour la table SQL Server Users
 * @author Entity Generator - 2025-03-31T21:09:06.014Z - Creation
 */
@Entity("Users")
export class User implements ObjectLiteral
{
    /**
     * userId
     */
    @PrimaryGeneratedColumn()
    userId!: number;

    /**
     * email
     * @maxLength 100
     */
    @Column({ length: 100, nullable: false })
    email!: string;

    /**
     * password
     * @maxLength 255
     */
    @Column({ length: 255, nullable: false })
    password!: string;

    /**
     * phoneNumber
     * @maxLength 20
     */
    @Column({ length: 20 })
    phoneNumber!: string;

    /**
     * lastLogin
     */
    @Column()
    lastLogin!: Date;

    /**
     * status
     * @maxLength 20
     */
    @Column({ length: 20 })
    status!: string;

}
