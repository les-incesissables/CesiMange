// api-gateway/src/proxySetup.ts

import { createProxyMiddleware } from "http-proxy-middleware";
import { Router } from "express";
import { GatewayConfig, ServiceDefinition } from "./gateway.config";

/**
 * Configure dynamiquement des proxys pour chaque service activé.
 */
export function setupProxies(router: Router, config: GatewayConfig): void {
  config.services.forEach((service: ServiceDefinition) => {
    if (service.enabled) {
      const routePath = `/${service.apiName}`;
      console.log(
        `Setting up proxy for [${service.apiName}] at path [${routePath}] -> [${service.url}]`
      );
      router.use(
        routePath,
        createProxyMiddleware({
          target: service.url,
          changeOrigin: true,
          pathRewrite: {
            [`^/${service.apiName}`]: "",
          },
        })
      );
    }
  });
}
