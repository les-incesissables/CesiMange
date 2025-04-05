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

        // 1. Vérifie les routes publiques avec matching manuel
        const publicRoute = service.publicRoutes?.find(route =>
        {
            const result = matchRoute(route.path, req);
            return result.match && isMethodMatch(route.methods, method);
        });
        if (publicRoute) return next();

        // 2. Vérifie les routes protégées avec matching manuel
        const protectedRoute = service.protectedRoutes?.find(route =>
        {
            const result = matchRoute(route.path, req);
            return result.match && isMethodMatch(route.methods, method);
        });

        if (!protectedRoute)
        {
            return res.status(403).json({ error: 'Route protégée non autorisée' });
        }

        // Optionnel : fusionner les params extraits dans req.params
        const matchResult = matchRoute(protectedRoute.path, req);
        req.params = { ...req.params, ...matchResult.params };

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

        // 4. Vérifie les permissions
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

        // 5. Vérifie les rôles
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

    /**
  * Compare le chemin configuré (ex: "/users/:id") avec le chemin effectif (ex: "/users/15")
  * et extrait les paramètres dynamiques.
  */
    function matchRoute(configuredPath: string, req: Request): { match: boolean; params: Record<string, string> }
    {
        const configParts = configuredPath.split('/').filter(Boolean);
        const actualParts = req.path.split('/').filter(Boolean);

        if (configParts.length !== actualParts.length)
        {
            return { match: false, params: {} };
        }

        const params: Record<string, string> = {};

        for (let i = 0; i < configParts.length; i++)
        {
            const configSegment = configParts[i];
            const actualSegment = actualParts[i];

            if (configSegment.startsWith(':'))
            {
                const paramName = configSegment.substring(1);
                params[paramName] = decodeURIComponent(actualSegment);
            } else if (configSegment !== actualSegment)
            {
                return { match: false, params: {} };
            }
        }

        return { match: true, params };
    }



}
