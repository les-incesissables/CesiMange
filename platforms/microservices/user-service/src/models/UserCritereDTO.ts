import { ObjectLiteral } from "typeorm";
/**
 * CritereDTO pour la recherche d'entit�s SQL Server User
 * @author DTO Generator - 2025-03-31T21:09:06.015Z - Creation
 */
export class UserCritereDTO implements ObjectLiteral
{
    /**
     * Crit�re de recherche pour userId
     */
    userId?: number | undefined;

    /**
     * Crit�re de recherche pour email
     */
    email?: string | undefined;

    /**
     * Recherche avec LIKE pour email
     */
    emailLike?: string | undefined;

    /**
     * Crit�re de recherche pour password
     */
    password?: string | undefined;

    /**
     * Recherche avec LIKE pour password
     */
    passwordLike?: string | undefined;

    /**
     * Crit�re de recherche pour phoneNumber
     */
    phoneNumber?: string | undefined;

    /**
     * Recherche avec LIKE pour phoneNumber
     */
    phoneNumberLike?: string | undefined;

    /**
     * Crit�re de recherche pour lastLogin
     */
    lastLogin?: Date | undefined;

    /**
     * Valeur minimale pour lastLogin
     */
    lastLoginMin?: Date | undefined;

    /**
     * Valeur maximale pour lastLogin
     */
    lastLoginMax?: Date | undefined;

    /**
     * Crit�re de recherche pour status
     */
    status?: string | undefined;

    /**
     * Recherche avec LIKE pour status
     */
    statusLike?: string | undefined;

}
