// src/api/BaseRepository.ts

import { IApiRepository } from './IApiRepository';
import { ApiProxy } from 'customer-final-proxy';

export abstract class BaseRepository<DTO, CritereDTO> implements IApiRepository<DTO, CritereDTO>
{
    constructor (
        protected apiProxy: ApiProxy,
        protected endpoint: string,
    ) { }

    public async getItems(pCritereDTO: CritereDTO, page: number = 1, limit: number = 10): Promise<DTO[]>
    {
        const query = new URLSearchParams();
        query.append('page', page.toString());
        query.append('limit', limit.toString());

        const response = await this.apiProxy.get<DTO[]>(`${this.endpoint}?${query.toString()}`, undefined, pCritereDTO);
        return response.data;
    }

    public async getItem(id: string): Promise<DTO>
    {
        const response = await this.apiProxy.get<DTO>(`${this.endpoint}/${id}`);
        return response.data;
    }

    public async createItem(data: DTO): Promise<DTO>
    {
        const response = await this.apiProxy.post<DTO>(this.endpoint, data);
        return response.data;
    }

    public async updateItem(id: string, data: Partial<DTO>): Promise<DTO>
    {
        const response = await this.apiProxy.put<DTO>(`${this.endpoint}/${id}`, data);
        return response.data;
    }

    public async deleteItem(id: string): Promise<void>
    {
        await this.apiProxy.delete<void>(`${this.endpoint}/${id}`);
    }
}
