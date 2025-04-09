// src/api/IApiRepository.ts

export interface IApiRepository<DTO, CritereDTO>
{
    getItems(pCritereDTO: CritereDTO, page?: number, limit?: number): Promise<DTO[]>;
    getItem(id: string): Promise<DTO>;
    createItem(data: DTO): Promise<DTO>;
    updateItem(id: string, data: Partial<DTO>): Promise<DTO>;
    deleteItem(id: string): Promise<void>;
}
