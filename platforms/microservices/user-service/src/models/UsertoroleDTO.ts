import { Entity, Column, PrimaryColumn, ObjectLiteral, PrimaryGeneratedColumn } from "typeorm";

/**
 * Entit� TypeORM pour la table SQL Server UserToRoles
 * @author Entity Generator - 2025-03-31T18:35:05.923Z - Creation
 */
@Entity("UserToRoles")
export class Usertorole
{
    /**
     * userId
     */
    @PrimaryGeneratedColumn()
    userId: number | undefined;

    /**
     * roleId
     */
    @PrimaryGeneratedColumn()
    roleId: number | undefined;

}
