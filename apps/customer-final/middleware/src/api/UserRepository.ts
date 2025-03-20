// apps/customer-app/local-middleware/src/api/UserRepository.ts

import { IApiRepository } from "./IApiRepository";
import { ApiProxy } from "../../../proxy/src/ApiProxy";

export interface User {
  id: string;
  name: string;
  email: string;
  // Additional fields...
}

export class UserRepository implements IApiRepository<User> {
  private apiProxy: ApiProxy;
  private endpoint: string = "/users";

  constructor() {
    this.apiProxy = new ApiProxy();
  }

  public async fetchAll(): Promise<User[]> {
    const response = await this.apiProxy.get(this.endpoint);
    return response.data;
  }

  public async fetchById(id: string): Promise<User> {
    const response = await this.apiProxy.get(`${this.endpoint}/${id}`);
    return response.data;
  }

  public async create(data: User): Promise<User> {
    const response = await this.apiProxy.post(this.endpoint, data);
    return response.data;
  }

  public async update(id: string, data: Partial<User>): Promise<User> {
    const response = await this.apiProxy.put(`${this.endpoint}/${id}`, data);
    return response.data;
  }

  public async delete(id: string): Promise<void> {
    await this.apiProxy.delete(`${this.endpoint}/${id}`);
  }
}
