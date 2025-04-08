// src/api/UserRepository.ts

import { BaseRepository } from './BaseRepository';


export class RestaurantRepository extends BaseRepository<any> {
    constructor(apiProxy: any) {
        super(apiProxy, '/restaurants');
    }
}
