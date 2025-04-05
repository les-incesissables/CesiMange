// src/access-control/checkAccess.ts
import { Request, Response, NextFunction } from 'express';
import { IServiceDefinition } from '../interfaces/IServiceDefinition';
import { AuthJWT } from '../utils/authJWT';
import { JwtPayload } from 'jsonwebtoken';

export function checkAccess(service: IServiceDefinition)
{
    return (req: Request, res: Response, next: NextFunction) =>
    {
        const method = req.method.toUpperCase();
        const path = req.path;

        const isMethodMatch = (methods: string[], m: string) =>
            methods.map(x => x.toUpperCase()).includes(m);

        // 1. Vérifie les routes publiques (exact match)
        const publicRoute = service.publicRoutes?.find(route =>
            path === route.path && isMethodMatch(route.methods, method)
        );
        if (publicRoute) return next();

        // 2. Vérifie les routes protégées (exact match)
        const protectedRoute = service.protectedRoutes?.find(route =>
            path === route.path && isMethodMatch(route.methods, method)
        );

        if (!protectedRoute)
        {
            return res.status(403).json({ error: 'Route protégée non autorisée' });
        }

        // 3. Récupération et vérification du token
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer '))
        {
            return res.status(401).json({ error: 'Token manquant' });
        }

        const token = authHeader.split(' ')[1];
        let payload: JwtPayload | null;
        try
        {
            payload = AuthJWT.verifyToken(token);
        } catch (err)
        {
            return res.status(401).json({ error: 'Token invalide' });
        }

        if (!payload)
        {
            return res.status(401).json({ error: 'Token invalide ou vide' });
        }

        // 4. Permissions
        if (protectedRoute.requiredPermissions)
        {
            const userPerms = payload.permissions || [];
            const hasPermission = protectedRoute.requiredPermissions.every(p =>
                userPerms.includes(p)
            );
            if (!hasPermission)
            {
                return res.status(403).json({ error: 'Permissions insuffisantes' });
            }
        }

        // 5. Rôles
        if (protectedRoute.allowedRoles)
        {
            const userRoles = payload.roles || [];
            const hasRole = protectedRoute.allowedRoles.some(r =>
                userRoles.includes(r)
            );
            if (!hasRole)
            {
                return res.status(403).json({ error: 'Accès réservé aux rôles spécifiques' });
            }
        }

        next();
    };
}
