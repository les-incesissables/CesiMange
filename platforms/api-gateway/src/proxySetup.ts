import { createProxyMiddleware, Options } from "http-proxy-middleware";
import type { Request, Response } from "express";
import type { ClientRequest, IncomingMessage } from "http";
import { GatewayConfig, ServiceDefinition } from "./gateway.config";

export function setupProxies(router: any, config: GatewayConfig): void {
  console.log("[ProxySetup] Loaded configuration:", config);

  // Créez une liste des routes disponibles pour le diagnostic
  const availableRoutes: string[] = [];

  config.services.forEach((service: ServiceDefinition) => {
    if (service.enabled) {
      // Ici, on monte le proxy sur '/api/<apiName>'
      const routePath = `/api/${service.apiName}`;
      availableRoutes.push(routePath);
      console.log(
        `[ProxySetup] Setting up proxy for [${service.apiName}] at path [${routePath}] -> [${service.url}]`
      );

      router.use(
        routePath,
        createProxyMiddleware({
          target: service.url,
          changeOrigin: true,
          // On retire le préfixe '/api/<apiName>' pour que le microservice reçoive la requête
          pathRewrite: { [`^/api/${service.apiName}`]: "" },
          onProxyReq: (
            proxyReq: ClientRequest,
            req: Request,
            res: Response
          ) => {
            console.log("[onProxyReq] =>");
            console.log(
              `[Proxy Request] ${req.method} ${req.originalUrl} is being proxied to ${service.url}`
            );
          },
          onProxyRes: (
            proxyRes: IncomingMessage,
            req: Request,
            res: Response
          ) => {
            console.log(
              `[onProxyRes] => [Proxy Response] ${req.method} ${req.originalUrl} responded with status ${proxyRes.statusCode}`
            );
          },
          onError: (err: Error, req: Request, res: Response) => {
            console.error(
              `[onProxyError] => Error proxying ${req.method} ${req.originalUrl}:`,
              err
            );
            if (!res.headersSent) {
              res.status(504).json({
                code: 504,
                status: "Error",
                message: "Service unavailable, please try again later.",
                data: null,
              });
            }
          },
        } as Options)
      );
    } else {
      console.log(`[ProxySetup] Service [${service.apiName}] is disabled.`);
    }
  });

  // Log des routes configurées
  console.log("[ProxySetup] Available proxy routes:", availableRoutes);

  // Middleware final pour attraper les requêtes non traitées par un proxy
  router.use((req: Request, res: Response) => {
    console.warn(
      `[ProxySetup] [Gateway Warning] No matching proxy found for ${req.method} ${req.originalUrl}`
    );
    console.warn("[ProxySetup] Available proxy routes:", availableRoutes);
    res.status(404).json({
      code: 404,
      status: "Error",
      message: "No matching service found in Gateway.",
      data: null,
    });
  });
}
