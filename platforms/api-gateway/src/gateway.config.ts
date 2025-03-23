// api-gateway/src/gateway.config.ts

export interface ServiceDefinition {
  apiName: string;
  url: string;
  enabled: boolean;
}

export interface GatewayConfig {
  port: number;
  services: ServiceDefinition[];
}

export function loadGatewayConfig(): GatewayConfig {
  return {
    port: Number(process.env.GATEWAY_PORT) || 3000,
    services: [
      {
        apiName: "auth",
        url: process.env.AUTH_SERVICE_URL || "http://localhost:4001",
        enabled: process.env.AUTH_SERVICE_ENABLED
          ? process.env.AUTH_SERVICE_ENABLED === "true"
          : true,
      },
      {
        apiName: "users",
        url: process.env.USER_SERVICE_URL || "http://localhost:4002",
        enabled: process.env.USER_SERVICE_ENABLED
          ? process.env.USER_SERVICE_ENABLED === "true"
          : true,
      },
      {
        apiName: "restaurant",
        url: process.env.RESTAURANT_SERVICE_URL || "http://localhost:4003",
        enabled: process.env.RESTAURANT_SERVICE_ENABLED
          ? process.env.RESTAURANT_SERVICE_ENABLED === "true"
          : true,
      },
    ],
  };
}
