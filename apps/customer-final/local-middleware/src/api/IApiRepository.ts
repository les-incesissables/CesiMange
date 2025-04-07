// src/api/IApiRepository.ts

export interface IApiRepository<T> {
    fetchAll(page?: number, limit?: number): Promise<T[]>;
    fetchById(id: string): Promise<T>;
    create(data: T): Promise<T>;
    update(id: string, data: Partial<T>): Promise<T>;
    delete(id: string): Promise<void>;
}
