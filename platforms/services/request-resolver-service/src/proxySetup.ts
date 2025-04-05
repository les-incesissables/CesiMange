import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { Router, Request, Response, NextFunction } from 'express';
import { IGatewayConfig } from './interfaces/IGatewayConfig';
import { IServiceDefinition } from './interfaces/IServiceDefinition';

interface ProxyOptions extends Options
{
    pathRewrite: {
        [key: string]: string;
    };
}

export function setupProxies(router: Router, config: IGatewayConfig): void
{
    if (!config?.services)
    {
        throw new Error('Configuration des services invalide');
    }

    config.services.forEach((service: IServiceDefinition) =>
    {
        if (!service.enabled || !service.url) return;

        // Dans la fonction setupProxies
        const lPathRewrite : any = {};
        lPathRewrite[`^/${service.apiName}`] = service.url.endsWith(service.apiName) ? '' : '/';

        const proxyOptions: ProxyOptions = {
            target: service.url,
            changeOrigin: true,
            pathRewrite: {},
            timeout: 30000 // Augmenter le timeout
        };

        // Configuration du proxy
        const proxy = createProxyMiddleware(proxyOptions);

        // Ajouter des logs avant l'utilisation du middleware
        router.use(`/${service.apiName}`, (req: Request, res: Response, next: NextFunction) =>
        {
            console.log(`[Proxy] Requête entrante: ${req.method} ${req.originalUrl} -> ${service.url}`);

            // Sauvegarder le temps de début pour calculer la durée
            const startTime = Date.now();

            // Intercepter la fin de la réponse pour logger
            const originalEnd = res.end;
            res.end = function (this: Response): Response
            {
                const duration = Date.now() - startTime;
                console.log(`[Proxy] Réponse: ${res.statusCode}, durée: ${duration}ms`);
                return originalEnd.apply(this);
            };

            next();
        }, proxy);

        console.log(`Proxy configuré: /${service.apiName}/* -> ${service.url}`);
    });

    // Middleware pour les erreurs de proxy
    router.use((err: Error, req: Request, res: Response, next: NextFunction) =>
    {
        console.error(`[Proxy] Erreur:`, err);
        if (!res.headersSent)
        {
            res.status(500).json({ error: `Erreur de proxy: ${err.message || 'Erreur inconnue'}` });
        }
        next(err);
    });

    // Middleware pour les routes non trouvées
    router.use((req: Request, res: Response) =>
    {
        console.warn(`Route non trouvée: ${req.method} ${req.url}`);
        res.status(404).json({ error: 'Service non trouvé' });
    });
}