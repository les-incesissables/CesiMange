// request-resolver-service/src/proxySetup.ts
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { Router } from 'express';
import { IGatewayConfig } from './interfaces/IGatewayConfig';
import { IServiceDefinition } from './interfaces/IServiceDefinition';

/**
 * Configuration type-safe pour le proxy middleware
 */
interface ProxyOptions extends Options
{
    pathRewrite: {
        [key: string]: string;
    };
}

/**
 * Configure dynamiquement des proxys pour chaque service activé
 * avec gestion d'erreur et logging amélioré
 */
export function setupProxies(router: Router, config: IGatewayConfig): void
{
    if (!config?.services)
    {
        console.error('Configuration invalide : aucun service défini');
        throw new Error('Configuration des services invalide');
    }

    config.services.forEach((service: IServiceDefinition) =>
    {
        if (!service.enabled)
        {
            console.debug(`Service [${service.apiName}] est désactivé - ignoré`);
            return;
        }

        if (!service.url)
        {
            console.warn(`URL non définie pour le service [${service.apiName}] - ignoré`);
            return;
        }

        const lRoutePath = `/${service.apiName}`;
        const lProxyOptions: ProxyOptions = {
            target: service.url,
            changeOrigin: true,
            pathRewrite: {}, // Désactive la réécriture d'URL
            timeout: 5000
        };

        try
        {
            router.use(
                lRoutePath,
                createProxyMiddleware(lProxyOptions)
            );
            console.info(`Proxy configuré: [${lRoutePath}] -> [${service.url}]`);
        } catch (error)
        {
            console.error(`Échec de configuration du proxy pour ${service.apiName}: ${error}`);
        }
    });
}