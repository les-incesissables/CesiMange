// api-gateway/src/utils/logger.ts

import morgan from "morgan";

/**
 * Middleware de logging HTTP avec Morgan.
 */
export const logger = morgan("combined");
