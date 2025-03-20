import { BaseCritereDTO } from "../../../models/base/BaseCritereDTO";
import { BaseDTO } from "../../../models/base/BaseDTO";
import { IDbRepository } from "../../interfaces/IDbRepository";
import { IRepositoryConfig } from "../../interfaces/IRepositoryConfig";

/**
 * Classe abstraite avec les méthodes communes pour tous les repositories
 */
export abstract class AbstractDbRepository<DTO extends BaseDTO, CritereDTO extends BaseCritereDTO> implements IDbRepository<DTO, CritereDTO>
{
    protected _config: IRepositoryConfig;

    constructor (pConfig: IRepositoryConfig)
    {
        this._config = pConfig;
    }

    public abstract initialize(): Promise<void>;
    abstract getItems(pCritereDTO: CritereDTO): Promise<DTO[]>;
    abstract getItem(pCritereDTO: CritereDTO): Promise<DTO>;
    abstract createItem(pDTO: DTO): Promise<DTO>;
    abstract updateItem(pDTO: DTO, pCritereDTO: CritereDTO): Promise<DTO>;
    abstract deleteItem(pCritereDTO: CritereDTO): Promise<boolean>;
    abstract itemExists(pCritereDTO: CritereDTO): Promise<boolean>;
    abstract disconnect(): Promise<void>;
    abstract buildFilter(pCritereDTO: CritereDTO): any;
    abstract formatResults(pResults: any[]): DTO[];

    /**
     * Vérifie si une valeur est une date
     */
    protected isDate(dateStr: any): boolean
    {
        if (typeof dateStr === 'string')
        {
            return !isNaN(new Date(dateStr).getDate());
        }
        return dateStr instanceof Date;
    }

    /**
     * Échappe les caractères spéciaux pour les expressions régulières
     */
    protected escapeRegex(value: string): string
    {
        return value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }
}