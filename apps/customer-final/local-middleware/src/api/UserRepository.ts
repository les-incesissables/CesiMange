// src/api/UserRepository.ts
import { BaseRepository } from './BaseRepository';

export class UserRepository extends BaseRepository<any, any> {
    constructor(apiProxy: any) {
        super(apiProxy, '/user-profiles');
    }
}
