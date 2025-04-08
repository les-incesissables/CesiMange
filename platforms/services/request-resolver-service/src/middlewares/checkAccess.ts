// src/access-control/checkAccess.ts
import { Request, Response, NextFunction } from 'express';
import { IServiceDefinition } from '../interfaces/IServiceDefinition';
import { AuthJWT } from '../utils/authJWT';
import { JwtPayload } from 'jsonwebtoken';

export function checkAccess(pService: IServiceDefinition)
{
    return (req: Request, res: Response, next: NextFunction) =>
    {
        let payload: JwtPayload | null;
        const lMethod = req.method.toUpperCase();

        const isMethodMatch = (methods: string[], m: string) =>
            methods.map(x => x.toUpperCase()).includes(m);

        // 1. Vérifie les routes publiques avec matching manuel
        const lPublicRoute = pService.publicRoutes?.find(route =>
        {
            const result = matchRoute(route.path, req);
            return result.match && isMethodMatch(route.methods, lMethod);
        });
        if (lPublicRoute) return next();

        // 2. Vérifie les routes protégées avec matching manuel
        const lProtectedRoute = pService.protectedRoutes?.find(route =>
        {
            const lResult = matchRoute(route.path, req);
            return lResult.match && isMethodMatch(route.methods, lMethod);
        });

        if (!lProtectedRoute)
        {
            return res.status(403).json({ error: 'Route protégée non autorisée' });
        }

        // Optionnel : fusionner les params extraits dans req.params
        const lMatchResult = matchRoute(lProtectedRoute.path, req);
        req.params = { ...req.params, ...lMatchResult.params };

        // 3. Récupération et vérification du token
        const lAuthHeader = req.headers.authorization;
        if (!lAuthHeader || !lAuthHeader.startsWith('Bearer '))
        {
            return res.status(401).json({ error: 'Token manquant' });
        }

        const lToken = lAuthHeader.split(' ')[1];

        try
        {
            // cm - Verification du token
            payload = AuthJWT.verifyToken(lToken);

        } catch (err)
        {
            return res.status(401).json({ error: 'Token invalide' });
        }
        if (!payload)
        {
            return res.status(401).json({ error: 'Token invalide ou vide' });
        }

        // 4. Vérifie les permissions
        if (lProtectedRoute.requiredPermissions)
        {
            const userPerms = payload.permissions || [];
            const hasPermission = lProtectedRoute.requiredPermissions.every(p =>
                userPerms.includes(p)
            );
            if (!hasPermission)
            {
                return res.status(403).json({ error: 'Permissions insuffisantes' });
            }
        }

        // 5. Vérifie les rôles
        if (lProtectedRoute.allowedRoles)
        {
            const userRoles = payload.roles || [];
            const hasRole = lProtectedRoute.allowedRoles.some(r =>
                userRoles.includes(r)
            );
            if (!hasRole)
            {
                return res.status(403).json({ error: 'Accès réservé aux rôles spécifiques' });
            }
        }

        if (lProtectedRoute.ownershipCheck)
        {
            const { matchField, paramName } = lProtectedRoute.ownershipCheck;

            if (!matchField || !paramName)
            {
                return res.status(500).json({ message: 'Mauvaise configuration ownershipCheck.' });
            }

            const userValue = payload[matchField as keyof typeof payload];
            const paramValue = req.params[paramName];

            if (!userValue || !paramValue)
            {
                return res.status(403).json({ message: 'Accès refusé : données manquantes.' });
            }

            if (userValue != paramValue)
            {
                return res.status(403).json({ message: 'Accès refusé : vous n’êtes pas propriétaire.' });
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
