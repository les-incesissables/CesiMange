import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { loadGatewayConfig } from "./gateway.config";
import { setupProxies } from "./proxySetup";
import { securityMiddleware } from "./middlewares/security.middleware";
import { rateLimitMiddleware } from "./middlewares/rateLimit.middleware";
import { logger } from "./utils/logger";
import { requestLogger } from "./middlewares/requestLogger.middleware";

dotenv.config();

async function startGateway() {
  const config = loadGatewayConfig();
  const app = express();

  console.log("[Index] Starting API Gateway with config:", config);

  // Middlewares de base
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(logger); // Morgan pour logs HTTP

  // Middleware personnalisé pour afficher la provenance
  app.use(requestLogger);

  // Middlewares de sécurité
  app.use(...securityMiddleware());

  // Middleware de rate limiting
  app.use(rateLimitMiddleware);

  // Configuration des proxys
  setupProxies(app, config);

  // Route de test
  app.get("/", (req: Request, res: Response) => {
    console.log("[Index] Received GET /");
    res.send("API Gateway is running with dynamic services and logging!");
  });

  // Middleware pour les requêtes non traitées (404)
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.warn(
      `[Index] [Gateway Warning] No matching proxy found for ${req.method} ${req.originalUrl}`
    );
    res.status(404).json({
      code: 404,
      status: "Error",
      message: "No matching service found.",
      data: null,
    });
  });

  // Middleware d'erreur pour capturer les erreurs de proxy
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(
      `[Index] [Gateway Error] Error occurred for ${req.method} ${req.originalUrl}:`,
      err
    );
    res.status(err.status || 500).json({
      code: err.status || 500,
      status: "Error",
      message: err.message || "Internal Server Error",
      data: null,
    });
  });

  app.listen(config.port, () => {
    console.log(`[Index] API Gateway listening on port ${config.port}`);
  });
}

startGateway().catch((err) => {
  console.error("[Index] Failed to start API Gateway:", err);
});
