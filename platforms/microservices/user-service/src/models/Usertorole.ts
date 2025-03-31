import { Entity, Column, PrimaryColumn, ObjectLiteral, PrimaryGeneratedColumn } from "typeorm";

/**
 * Entit� TypeORM pour la table SQL Server UserToRoles
 * @author Entity Generator - 2025-03-31T21:09:06.030Z - Creation
 */
@Entity("UserToRoles")
export class Usertorole implements ObjectLiteral
{
    /**
     * userId
     */
    @PrimaryGeneratedColumn()
    userId!: number;

    /**
     * roleId
     */
    @PrimaryGeneratedColumn()
    roleId!: number;

}
