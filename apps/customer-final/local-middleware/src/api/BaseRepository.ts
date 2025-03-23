// src/api/BaseRepository.ts

import { IApiRepository } from './IApiRepository';
import { ApiProxy } from 'customer-final-proxy';

export abstract class BaseRepository<T> implements IApiRepository<T> {
    constructor(
        protected apiProxy: ApiProxy,
        protected endpoint: string,
    ) {}

    public async fetchAll(): Promise<T[]> {
        const response = await this.apiProxy.get<T[]>(this.endpoint);
        return response.data;
    }

    public async fetchById(id: string): Promise<T> {
        const response = await this.apiProxy.get<T>(`${this.endpoint}/${id}`);
        return response.data;
    }

    public async create(data: T): Promise<T> {
        const response = await this.apiProxy.post<T>(this.endpoint, data);
        return response.data;
    }

    public async update(id: string, data: Partial<T>): Promise<T> {
        const response = await this.apiProxy.put<T>(`${this.endpoint}/${id}`, data);
        return response.data;
    }

    public async delete(id: string): Promise<void> {
        await this.apiProxy.delete<void>(`${this.endpoint}/${id}`);
    }
}
