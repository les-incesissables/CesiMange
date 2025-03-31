import { ObjectLiteral } from "typeorm";
/**
 * CritereDTO pour la recherche d'entit�s SQL Server Usertorole
 * @author DTO Generator - 2025-03-31T21:09:06.030Z - Creation
 */
export class UsertoroleCritereDTO implements ObjectLiteral
{
    /**
     * Crit�re de recherche pour userId
     */
    userId?: number | undefined;

    /**
     * Crit�re de recherche pour roleId
     */
    roleId?: number | undefined;

}
