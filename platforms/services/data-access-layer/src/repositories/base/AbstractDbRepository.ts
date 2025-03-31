import { IDbRepository } from '../../interfaces/IDbRepository';
import { IRepositoryConfig } from '../../interfaces/IRepositoryConfig';

/**
 * Classe abstraite avec les m�thodes communes pour tous les repositories
 */
export abstract class AbstractDbRepository<DTO, CritereDTO> implements IDbRepository<DTO, CritereDTO> {
    protected _config: IRepositoryConfig;

    /**
     * Constructeur du AbstractDbRepository
     * @param pConfig Configuration du repository
     */
    constructor(pConfig: IRepositoryConfig) {
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
     * V�rifie si une valeur est une date
     */
    protected isDate(dateStr: any): boolean {
        if (typeof dateStr === 'string') {
            return !isNaN(new Date(dateStr).getDate());
        }
        return dateStr instanceof Date;
    }

    /**
     * �chappe les caract�res sp�ciaux pour les expressions r�guli�res
     */
    protected escapeRegex(pValue: string): string {
        return pValue.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }
}
