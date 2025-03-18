import { OrderDTO } from "../../models/order/OrderDTO";
import { OrderCritereDTO } from "../../models/order/OrderCritereDTO";
import { BaseMetier } from "../base/BaseMetier";
import { Repository } from "../../DAL/repositories/base/Repository";
import { IRepositoryConfig } from "../../DAL/repositories/base/IRepositoryConfig";

/**
 * M�tier pour l'entit� Order
 * @Author ModelGenerator - 2025-03-18T11:10:29.577Z - Cr�ation
 */
export class OrderMetier extends BaseMetier<OrderDTO, OrderCritereDTO> {
    constructor() {
        const config: IRepositoryConfig = {
            collectionName: 'order', // Collection MongoDB
            connectionString: 'mongodb://localhost:27017/projet',
            dbName: 'projet'
        };

        const repo = new Repository<OrderDTO, OrderCritereDTO>(config);
        super(repo);
    }
}