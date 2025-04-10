// src/access-control/checkAccess.ts
import { Request, Response, NextFunction } from 'express';
import { IServiceDefinition } from '../interfaces/IServiceDefinition';
import { AuthJWT } from '../utils/authJWT';
import { JwtPayload } from 'jsonwebtoken';

export function checkAccess(pService: IServiceDefinition) {
    return (req: Request, res: Response, next: NextFunction) => {
        let payload: JwtPayload | null;
        const lMethod = req.method.toUpperCase();

        const isMethodMatch = (methods: string[], m: string) => methods.map((x) => x.toUpperCase()).includes(m);

        // 1. V�rifie les routes publiques avec matching manuel
        const lPublicRoute = pService.publicRoutes?.find((route) => {
            const result = matchRoute(route.path, req);
            return result.match && isMethodMatch(route.methods, lMethod);
        });
        if (lPublicRoute) return next();

        // 2. V�rifie les routes prot�g�es avec matching manuel
        const lProtectedRoute = pService.protectedRoutes?.find((route) => {
            const lResult = matchRoute(route.path, req);
            return lResult.match && isMethodMatch(route.methods, lMethod);
        });

        if (!lProtectedRoute) {
            return res.status(403).json({ error: 'Route prot�g�e non autoris�e' });
        }

        // Optionnel : fusionner les params extraits dans req.params
        const lMatchResult = matchRoute(lProtectedRoute.path, req);
        req.params = { ...req.params, ...lMatchResult.params };

        // 3. R�cup�ration et v�rification du token
        const lAuthHeader = req.headers.authorization;

        let lToken: string;

        if (lAuthHeader && lAuthHeader.startsWith('Bearer ')) {
            lToken = lAuthHeader.split(' ')[1];
        } else if (req.cookies && req.cookies['access_token']) {
            lToken = req.cookies['access_token'];
        } else {
            return res.status(401).json({ error: 'Token manquant' });
        }

        try {
            // cm - Verification du token
            payload = AuthJWT.verifyToken(lToken);
        } catch (err) {
            return res.status(401).json({ error: 'Token invalide' });
        }
        if (!payload) {
            return res.status(401).json({ error: 'Token invalide ou vide' });
        }

        // 4. V�rifie les permissions
        if (lProtectedRoute.requiredPermissions) {
            const userPerms = payload.permissions || [];
            const hasPermission = lProtectedRoute.requiredPermissions.every((p) => userPerms.includes(p));
            if (!hasPermission) {
                return res.status(403).json({ error: 'Permissions insuffisantes' });
            }
        }

        // 5. V�rifie les r�les
        if (lProtectedRoute.allowedRoles) {
            const userRoles = payload.roles || [];
            const hasRole = lProtectedRoute.allowedRoles.some((r) => userRoles.includes(r));
            if (!hasRole) {
                return res.status(403).json({ error: 'Acc�s r�serv� aux r�les sp�cifiques' });
            }
        }

        if (lProtectedRoute.ownershipCheck) {
            const { matchField, paramName } = lProtectedRoute.ownershipCheck;

            if (!matchField || !paramName) {
                return res.status(500).json({ message: 'Mauvaise configuration ownershipCheck.' });
            }

            const userValue = payload[matchField as keyof typeof payload];
            const paramValue = req.params[paramName];

            if (!userValue || !paramValue) {
                return res.status(403).json({ message: 'Acc�s refus� : donn�es manquantes.' });
            }

            if (userValue != paramValue) {
                return res.status(403).json({ message: 'Acc�s refus� : vous n��tes pas propri�taire.' });
            }
        }

        next();
    };

    /**
     * Compare le chemin configur� (ex: "/users/:id") avec le chemin effectif (ex: "/users/15")
     * et extrait les param�tres dynamiques.
     */
    function matchRoute(configuredPath: string, req: Request): { match: boolean; params: Record<string, string> } {
        const configParts = configuredPath.split('/').filter(Boolean);
        const actualParts = req.path.split('/').filter(Boolean);

        if (configParts.length !== actualParts.length) {
            return { match: false, params: {} };
        }

        const params: Record<string, string> = {};

        for (let i = 0; i < configParts.length; i++) {
            const configSegment = configParts[i];
            const actualSegment = actualParts[i];

            if (configSegment.startsWith(':')) {
                const paramName = configSegment.substring(1);
                params[paramName] = decodeURIComponent(actualSegment);
            } else if (configSegment !== actualSegment) {
                return { match: false, params: {} };
            }
        }

        return { match: true, params };
    }
}
