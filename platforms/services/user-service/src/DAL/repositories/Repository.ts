import { Schema } from "mongoose";
import { BaseCritereDTO } from "../../models/base/BaseCritereDTO";
import { BaseDTO } from "../../models/base/BaseDTO";
import { EDatabaseType } from "../enums/EDatabaseType";
import { IRepositoryConfig } from "../interfaces/IRepositoryConfig";
import { BaseRepository } from "./base/BaseRepository";


/**
 * Repository de base générique pour MongoDB
 * @template DTO - Type de données retourné/manipulé qui étend BaseDTO
 * @template CritereDTO - Type des critères de recherche qui étend BaseCritereDTO
 * @author Mahmoud Charif - CESIMANGE-118 - 17/03/2025 - Adaptation pour MongoDB
 */
export class Repository<DTO, Critere> extends BaseRepository<DTO, Critere>
{
    constructor (pCollectionName: string, pTypeBDD: EDatabaseType)
    {
        const config: IRepositoryConfig = {
            CollectionName: pCollectionName, // Collection MongoDB
            ConnectionString: process.env.CONNECTION_STRING || 'mongodb://localhost:27017/projet',
            DbName: 'CesiMange',
            TypeBDD: pTypeBDD
        };

        super(config)
    }
}