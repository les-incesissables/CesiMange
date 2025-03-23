// src/api/OrderRepository.ts

import { BaseRepository } from './BaseRepository';

export interface Order {
    id: string;
    userId: string;
    items: any[];
    total: number;
    status: string;
    // Additional fields if needed.
}

export class OrderRepository extends BaseRepository<Order> {
    constructor(apiProxy: any) {
        super(apiProxy, '/orders');
    }
}
