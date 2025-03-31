import { ObjectLiteral } from "typeorm";
/**
 * CritereDTO pour la recherche d'entit�s SQL Server Userrole
 * @author DTO Generator - 2025-03-31T21:09:06.023Z - Creation
 */
export class UserroleCritereDTO implements ObjectLiteral
{
    /**
     * Crit�re de recherche pour roleId
     */
    roleId?: number | undefined;

    /**
     * Crit�re de recherche pour roleName
     */
    roleName?: string | undefined;

    /**
     * Recherche avec LIKE pour roleName
     */
    roleNameLike?: string | undefined;

}
