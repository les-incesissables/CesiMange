// platforms/api-gateway/src/middlewares/rateLimit.middleware.ts
import rateLimit from "express-rate-limit";

/**
 * Middleware de limitation de taux (rate limiting) pour protéger contre les abus.
 */
export const rateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // maximum 100 requêtes par IP par window
  message: {
    code: 429,
    status: "Error",
    message: "Too many requests, please try again later.",
    data: null,
  },
});
