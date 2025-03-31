import { Entity, Column, PrimaryColumn, ObjectLiteral, PrimaryGeneratedColumn } from "typeorm";

/**
 * Entit� TypeORM pour la table SQL Server UserRoles
 * @author Entity Generator - 2025-03-31T18:35:05.915Z - Creation
 */
@Entity("UserRoles")
export class Userrole
{
    /**
     * roleId
     */
    @PrimaryGeneratedColumn()
    roleId: number | undefined;

    /**
     * roleName
     * @maxLength 50
     */
    @Column({ length: 50, nullable: false })
    roleName: string | undefined;

}
