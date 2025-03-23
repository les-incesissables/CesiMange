// src/api/RepositoryService.ts

import { ApiProxy } from 'customer-final-proxy';
import { OrderRepository } from './OrderRepository';
import { UserRepository } from './UserRepository';

const apiProxyInstance = new ApiProxy();

export const RepositoryService = {
    order: new OrderRepository(apiProxyInstance),
    user: new UserRepository(apiProxyInstance),
    // Add additional repositories as needed...
};
