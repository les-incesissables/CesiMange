// src/api/UserRepository.ts

import { BaseRepository } from './BaseRepository';


export class RestaurantRepository extends BaseRepository<any, any>
{
    constructor (apiProxy: any)
    {
        super(apiProxy, '/restaurants');
    }
}
