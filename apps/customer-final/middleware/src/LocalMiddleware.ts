// apps/customer-app/local-middleware/src/LocalMiddleware.ts

import { apiService } from "./api/apiService";
import { NormalizedResponse } from "./types";
import { mapErrorCodeToMessage } from "./utils/errorMapper";

export class LocalMiddleware {
  private orderRepo = apiService.order;
  private userRepo = apiService.user;

  private cache: Map<string, any> = new Map();
  private isOffline = false;

  constructor() {
    window.addEventListener("online", () => {
      this.isOffline = false;
      console.log("Network online.");
      // Possibly process queued requests
    });
    window.addEventListener("offline", () => {
      this.isOffline = true;
      console.warn("Network offline.");
    });
  }

  public processIncomingMessage(message: any): NormalizedResponse {
    if (!message) {
      return {
        status: "failure",
        data: null,
        uiMessage: "No response received.",
      };
    }
    if (message.error) {
      const code = message.error.code;
      return {
        status: "failure",
        data: message.error,
        uiMessage: mapErrorCodeToMessage(code),
      };
    } else if (message.pending) {
      return {
        status: "pending",
        data: message.pending,
        uiMessage: "Your request is being processed...",
      };
    }
    return {
      status: "success",
      data: message.data !== undefined ? message.data : message,
      uiMessage: "Operation successful.",
    };
  }

  public preprocessOutgoingMessage(payload: any): any {
    const processedPayload = { ...payload };
    Object.keys(processedPayload).forEach((key) => {
      if (processedPayload[key] == null) {
        delete processedPayload[key];
      }
    });
    return processedPayload;
  }

  public async callLocalApi(
    apiFunction: () => Promise<any>
  ): Promise<NormalizedResponse> {
    if (this.isOffline) {
      return {
        status: "failure",
        data: null,
        uiMessage: "You are offline. Please check your connection.",
      };
    }
    try {
      const response = await apiFunction();
      return this.processIncomingMessage(response);
    } catch (error: any) {
      console.error("Local API call error:", error);
      const errorCode = error?.response?.status;
      return {
        status: "failure",
        data: error,
        uiMessage: mapErrorCodeToMessage(errorCode),
      };
    }
  }

  /**
   * Récupère la liste des utilisateurs via le UserRepository.
   * @returns Une promesse résolue en NormalizedResponse contenant la liste des utilisateurs.
   */
  public async getUsers(): Promise<NormalizedResponse> {
    console.log("middleware getUsers");
    return this.callLocalApi(() => this.userRepo.fetchAll());
  }

  /**
   * Exemple d'autres méthodes spécifiques par entité…
   */
  public async getOrders(): Promise<NormalizedResponse> {
    return this.callLocalApi(() => this.orderRepo.fetchAll());
  }

  public async getUser(userId: string): Promise<NormalizedResponse> {
    return this.callLocalApi(() => this.userRepo.fetchById(userId));
  }

  // Cache management
  public cacheResponse(key: string, data: any): void {
    this.cache.set(key, data);
  }

  public getCachedResponse(key: string): any | undefined {
    return this.cache.get(key);
  }

  public clearCache(): void {
    this.cache.clear();
  }
}
