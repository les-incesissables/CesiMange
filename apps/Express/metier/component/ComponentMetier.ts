import { ComponentDTO } from "../../models/component/ComponentDTO";
import { ComponentCritereDTO } from "../../models/component/ComponentCritereDTO";
import { BaseMetier } from "../base/BaseMetier";
import { Repository } from "../../DAL/repositories/base/Repository";
import { IRepositoryConfig } from "../../DAL/repositories/base/IRepositoryConfig";

/**
 * M�tier pour l'entit� Component
 * @Author ModelGenerator - 2025-03-18T11:10:29.396Z - Cr�ation
 */
export class ComponentMetier extends BaseMetier<ComponentDTO, ComponentCritereDTO> {
    constructor() {
        const config: IRepositoryConfig = {
            collectionName: 'component', // Collection MongoDB
            connectionString: 'mongodb://localhost:27017/projet',
            dbName: 'projet'
        };

        const repo = new Repository<ComponentDTO, ComponentCritereDTO>(config);
        super(repo);
    }
}