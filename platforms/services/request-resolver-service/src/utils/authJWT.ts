import jwt, { JwtPayload } from "jsonwebtoken";
import { Secret, SignOptions, JwtPayload as JwtPayloadType, VerifyOptions } from 'jsonwebtoken';

// Étendre l'interface Request d'Express pour inclure l'utilisateur avec le format exact
declare global
{
    namespace Express
    {
        interface Request
        {
            user?: JwtPayload & {
                id: number;
                username: string;
                roles: string | string[];
                xsrfToken: string;
            };
        }
    }
}

/**
 * Classe utilitaire pour l'authentification JWT + CSRF
 * @author Mahmoud Charif - 01/04/2025 - CESIMANGE-70 - Creation
 * @modified - 02/04/2025 - Implémentation de la sécurité JWT+CSRF
 */

export class AuthJWT
{
    private static readonly JWT_SECRET: string = process.env.JWT_SECRET || "default_secret_key";

    /**
     * Vérifie un token JWT
     * @param token Le token à vérifier
     * @returns Le payload décodé ou null si le token est invalide
     */
    public static verifyToken(token: string): JwtPayload | null
    {
        try
        {
            return jwt.verify(token, this.JWT_SECRET, { algorithms: ['HS256'] }) as JwtPayload;
        } catch (error)
        {
            console.error('Erreur de vérification JWT:', error);
            return null;
        }
    }
}
