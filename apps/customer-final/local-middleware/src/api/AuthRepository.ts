// src/api/AuthRepository.ts
import { BaseRepository } from './BaseRepository';

export class AuthRepository extends BaseRepository<any, any> {
    constructor(apiProxy: any) {
        super(apiProxy, '/auth');
    }

    public async login(credentials: any): Promise<any> {
        return this.apiProxy.post(`${this.endpoint}/login`, credentials);
    }

    public async register(credentials: any): Promise<any> {
        return this.apiProxy.post(`${this.endpoint}/register`, credentials);
    }

    public async logout(): Promise<any> {
        return this.apiProxy.post(`${this.endpoint}/logout`, '');
    }
}
