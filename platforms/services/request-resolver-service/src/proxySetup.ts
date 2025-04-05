import { createProxyMiddleware, Options, fixRequestBody } from 'http-proxy-middleware';
import { Router, Request, Response, NextFunction } from 'express';
import { IGatewayConfig } from './interfaces/IGatewayConfig';
import { IServiceDefinition } from './interfaces/IServiceDefinition';
export function setupProxies(router: Router, config: IGatewayConfig): void
{
    if (!config?.services)
    {
        throw new Error('Configuration des services invalide');
    }

    config.services.forEach((service: IServiceDefinition) =>
    {
        if (!service.enabled || !service.BaseUrl) return;

        const proxyOptions: Options = {
            target: service.BaseUrl,
            changeOrigin: true,
            pathRewrite: {
                [`^/${service.apiName}`]: `/${service.apiName}` // Garde le préfixe
            },
            timeout: 10000,
            on: {
                proxyReq: fixRequestBody,
            }
        };

        const proxy = createProxyMiddleware(proxyOptions);

        // Middleware unique pour le logging et le proxy
        router.use(`/${service.apiName}`, (req: Request, res: Response, next: NextFunction) =>
        {
            console.log(`[Proxy] Requête entrante: ${req.method} ${req.originalUrl} -> ${service.BaseUrl}${req.path}`);

            const startTime = Date.now();

            const originalEnd = res.end;
            res.end = function (this: Response): Response
            {
                const duration = Date.now() - startTime;
                console.log(`[Proxy] Réponse: ${res.statusCode}, durée: ${duration}ms`);
                return originalEnd.apply(this);
            };
            proxy(req, res, next);
        });

        console.log(`Proxy configuré: /${service.apiName}/* -> ${service.BaseUrl}`);
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