import jwt, { JwtPayload } from "jsonwebtoken";
import { Secret, SignOptions, JwtPayload as JwtPayloadType, VerifyOptions } from 'jsonwebtoken';

// �tendre l'interface Request d'Express pour inclure l'utilisateur avec le format exact
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
 * @modified - 02/04/2025 - Impl�mentation de la s�curit� JWT+CSRF
 */

export class AuthJWT
{
    private static readonly JWT_SECRET: string = process.env.JWT_SECRET || "default_secret_key";

    /**
     * V�rifie un token JWT
     * @param token Le token � v�rifier
     * @returns Le payload d�cod� ou null si le token est invalide
     */
    public static verifyToken(token: string): JwtPayload | null
    {
        try
        {
            return jwt.verify(token, this.JWT_SECRET, { algorithms: ['HS256'] }) as JwtPayload;
        } catch (error)
        {
            console.error('Erreur de v�rification JWT:', error);
            return null;
        }
    }
}
