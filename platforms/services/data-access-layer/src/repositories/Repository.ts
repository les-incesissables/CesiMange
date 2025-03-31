import { EDatabaseType } from '../interfaces/enums/EDatabaseType';
import { IRepositoryConfig } from '../interfaces/IRepositoryConfig';
import { BaseRepository } from './base/BaseRepository';

/**
 * Repository de base g�n�rique pour MongoDB
 * @template DTO - Type de donn�es retourn�/manipul� qui �tend BaseDTO
 * @template CritereDTO - Type des crit�res de recherche qui �tend BaseCritereDTO
 * @author Mahmoud Charif - CESIMANGE-118 - 17/03/2025 - Adaptation pour MongoDB
 */
export class Repository<DTO, Critere> extends BaseRepository<DTO, Critere> {
    constructor(pCollectionName: string, pTypeBDD: EDatabaseType) {
        const config: IRepositoryConfig = {
            CollectionName: pCollectionName, // Collection MongoDB
            ConnectionString: process.env.CONNECTION_STRING || 'mongodb://localhost:27017/projet',
            DbName: 'CesiMange',
            TypeBDD: pTypeBDD,
        };

        super(config);
    }
}
