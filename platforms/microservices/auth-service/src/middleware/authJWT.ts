import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Secret, SignOptions, JwtPayload as JwtPayloadType, VerifyOptions } from 'jsonwebtoken';

// Étendre l'interface Request d'Express
declare global
{
    namespace Express
    {
        interface Request
        {
            user?: JwtPayload;
        }
    }
}

/**
 * Classe utilitaire pour l'authentification JWT
 * @author Mahmoud Charif - 01/04/2025 - CESIMANGE-70 - Creation
 */
export class AuthJWT
{
    /**
     * Génère un token JWT pour l'utilisateur
     * @param payload Les données à encoder dans le token
     * @returns Le token JWT généré
     */
    public static generateToken(payload: string): string
    {
        return jwt.sign(payload, process.env.JWT_SECRET || "");
    }

    /**
     * Vérifie un token JWT
     * @param token Le token à vérifier
     * @returns Le payload décodé ou null si le token est invalide
     */
    public static verifyToken(token: string): JwtPayload | null
    {
        try
        {
            return jwt.verify(token, process.env.JWT_SECRET || "") as JwtPayload;
        } catch (error)
        {
            return null;
        }
    }

    /**
     * Middleware pour authentifier les requêtes avec JWT
     * @param req Requête Express
     * @param res Réponse Express
     * @param next Fonction next
     */
    public static authenticateJWT = (req: Request, res: Response, next: NextFunction) =>
    {
        // cm - Recupere le Bearer Token
        const lAuthHeader = req.headers.authorization;

        if (!lAuthHeader)
        {
            return res.status(401).json({ message: 'Token d\'authentification manquant' });
        }

        const lToken = lAuthHeader.split(' ')[1]; // Format: "Bearer TOKEN"

        const lDecoded = this.verifyToken(lToken);
        if (!lDecoded)
        {
            return res.status(403).json({ message: 'Token invalide ou expiré' });
        }

        // Ajouter l'utilisateur décodé à l'objet de requête
        req.user = lDecoded;
        next();
    };

    /**
     * Middleware pour vérifier si l'utilisateur a un rôle spécifique
     * @param roles Rôle(s) requis pour accéder à la ressource
     * @returns Middleware Express
     */
    public static hasRole = (roles: string | string[]): ((req: Request, res: Response, next: NextFunction) => void) =>
    {
        const requiredRoles = Array.isArray(roles) ? roles : [roles];

        return (req: Request, res: Response, next: NextFunction) =>
        {
            if (!req.user)
            {
                return res.status(401).json({ message: 'Authentification requise' });
            }

            const userRoles = Array.isArray(req.user.roles) ? req.user.roles : [req.user.roles];
            const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

            if (!hasRequiredRole)
            {
                return res.status(403).json({ message: 'Accès refusé: rôle requis' });
            }

            next();
        };
    };

    /**
     * Middleware pour vérifier si l'utilisateur est propriétaire d'une ressource ou a un rôle d'admin
     * @param idExtractor Fonction pour extraire l'ID de la ressource demandée
     * @returns Middleware Express
     */
    public static isResourceOwnerOrAdmin = (
        idExtractor: (req: Request) => number
    ): ((req: Request, res: Response, next: NextFunction) => void) =>
    {
        return (req: Request, res: Response, next: NextFunction) =>
        {
            if (!req.user)
            {
                return res.status(401).json({ message: 'Authentification requise' });
            }

            const resourceId = idExtractor(req);
            const userId = req.user.id;

            const userRoles = Array.isArray(req.user.roles) ? req.user.roles : [req.user.roles];
            const isAdmin = userRoles.includes('admin');

            // Autoriser si l'utilisateur est propriétaire de la ressource ou s'il est admin
            if (userId === resourceId || isAdmin)
            {
                return next();
            }

            return res.status(403).json({ message: 'Accès non autorisé à cette ressource' });
        };
    };
}