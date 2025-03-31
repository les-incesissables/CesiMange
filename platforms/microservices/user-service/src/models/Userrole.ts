import { Entity, Column, PrimaryColumn, ObjectLiteral, PrimaryGeneratedColumn } from "typeorm";

/**
 * Entit� TypeORM pour la table SQL Server UserRoles
 * @author Entity Generator - 2025-03-31T21:09:06.022Z - Creation
 */
@Entity("UserRoles")
export class Userrole implements ObjectLiteral
{
    /**
     * roleId
     */
    @PrimaryGeneratedColumn()
    roleId!: number;

    /**
     * roleName
     * @maxLength 50
     */
    @Column({ length: 50, nullable: false })
    roleName!: string;

}
