// apps/customer-app/local-middleware/src/api/UserRepository.ts

import { IApiRepository } from './IApiRepository';
import { ApiProxy } from '../../../proxy/src/ApiProxy';

export interface User {
    id: string;
    name: string;
    email: string;
    // Additional fields...
}

export class UserRepository implements IApiRepository<User> {
    private apiProxy: ApiProxy;
    private endpoint: string = '/users';

    constructor() {
        this.apiProxy = new ApiProxy();
    }

    public async fetchAll(): Promise<User[]> {
        // Spécifiez que vous attendez un tableau de User
        const response = await this.apiProxy.get<User[]>(this.endpoint);
        return response.data;
    }

    public async fetchById(id: string): Promise<User> {
        // Spécifiez que vous attendez un User
        const response = await this.apiProxy.get<User>(`${this.endpoint}/${id}`);
        return response.data;
    }

    public async create(data: User): Promise<User> {
        // Spécifiez que vous attendez un User
        const response = await this.apiProxy.post<User>(this.endpoint, data);
        return response.data;
    }

    public async update(id: string, data: Partial<User>): Promise<User> {
        // Spécifiez que vous attendez un User
        const response = await this.apiProxy.put<User>(`${this.endpoint}/${id}`, data);
        return response.data;
    }

    public async delete(id: string): Promise<void> {
        // Spécifiez void pour l'absence de donnée en retour
        await this.apiProxy.delete<void>(`${this.endpoint}/${id}`);
    }
}
