// src/api/RepositoryService.ts

import { ApiProxy } from 'customer-final-proxy';
import { RestaurantRepository } from './RestaurantRepository';

const apiProxyInstance = new ApiProxy();

export const RepositoryService = {
    resto: new RestaurantRepository(apiProxyInstance),
    // Add additional repositories as needed...
};
