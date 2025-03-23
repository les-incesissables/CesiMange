// src/api/UserRepository.ts

import { BaseRepository } from './BaseRepository';

export interface User {
    id: string;
    name: string;
    email: string;
}

export class UserRepository extends BaseRepository<User> {
    constructor(apiProxy: any) {
        super(apiProxy, '/users');
    }
}
