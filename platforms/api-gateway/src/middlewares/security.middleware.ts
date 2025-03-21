// api-gateway/src/middlewares/security.middleware.ts

import helmet from "helmet";
import cors from "cors";
import { Request, Response, NextFunction } from "express";

export function securityMiddleware() {
  return [
    helmet(),
    cors({
      origin: "*", // À adapter pour votre production
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
    (req: Request, res: Response, next: NextFunction) => {
      res.removeHeader("X-Powered-By");
      next();
    },
  ];
}
