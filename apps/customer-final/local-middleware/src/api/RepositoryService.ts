// src/api/RepositoryService.ts

import { ApiProxy } from 'customer-final-proxy';
import { RestaurantRepository } from './RestaurantRepository';
import { AuthRepository } from './AuthRepository';
import { UserRepository } from './UserRepository';

const apiProxyInstance = new ApiProxy();

export const RepositoryService = {
    resto: new RestaurantRepository(apiProxyInstance),
    auth: new AuthRepository(apiProxyInstance),
    user: new UserRepository(apiProxyInstance),
};
