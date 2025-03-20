import { BaseCritereDTO } from "../../models/base/BaseCritereDTO";
import { BaseDTO } from "../../models/base/BaseDTO";
import { EDatabaseType } from "../enums/EDatabaseType";
import { BaseRepository } from "./base/BaseRepository";
import { IRepositoryConfig } from "./base/IRepositoryConfig";


/**
 * Repository de base générique pour MongoDB
 * @template DTO - Type de données retourné/manipulé qui étend BaseDTO
 * @template CritereDTO - Type des critères de recherche qui étend BaseCritereDTO
 * @author Mahmoud Charif - CESIMANGE-118 - 17/03/2025 - Adaptation pour MongoDB
 */
export class Repository<DTO extends BaseDTO, Critere extends BaseCritereDTO> extends BaseRepository<DTO, Critere>
{
    constructor (pCollectionName : string)
    {
        const config: IRepositoryConfig = {
            CollectionName: pCollectionName, // Collection MongoDB
            ConnectionString: process.env.CONNECTION_STRING || 'mongodb://localhost:27017/projet',
            DbName: 'CesiMange',
            TypeBDD: EDatabaseType.MONGODB
        };

        super(config)
    }
}