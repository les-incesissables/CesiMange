// api-gateway/src/index.ts

import express from "express";
import dotenv from "dotenv";
import { loadGatewayConfig } from "./gateway.config";
import { setupProxies } from "./proxySetup";
import { securityMiddleware } from "./middlewares/security.middleware";
import { rateLimitMiddleware } from "./middlewares/rateLimit.middleware";
import { logger } from "./utils/logger";

dotenv.config();

async function startGateway() {
  const config = loadGatewayConfig();
  const app = express();

  // Middlewares de base
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(logger);

  // Appliquer les middlewares de sécurité
  app.use(...securityMiddleware());

  // Appliquer le middleware de limitation de débit
  app.use(rateLimitMiddleware);

  // Configurer les proxys pour chaque service activé via la config unifiée
  setupProxies(app, config);

  // Route de test
  app.get("/", (req, res) => {
    res.send("API Gateway is running with dynamic services!");
  });

  // Gestion des routes non trouvées
  app.use((req, res) => {
    res.status(404).json({
      code: 404,
      status: "Error",
      message: "Route not found.",
      data: null,
    });
  });

  app.listen(config.port, () => {
    console.log(`API Gateway listening on port ${config.port}`);
  });
}

startGateway().catch((err) => {
  console.error("Failed to start API Gateway:", err);
});
