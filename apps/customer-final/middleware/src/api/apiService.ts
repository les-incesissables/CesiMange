// apps/customer-app/local-middleware/src/api/apiService.ts

import { OrderRepository } from "./OrderRepository";
import { UserRepository } from "./UserRepository";

export const apiService = {
  order: new OrderRepository(),
  user: new UserRepository(),
  // Add additional repositories as needed...
};
