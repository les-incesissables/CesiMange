import { BaseCritereDTO } from "../../models/base/BaseCritereDTO";
import { BaseDTO } from "../../models/base/baseDTO";

/**
 * Interface pour les controllers
 */
export interface IBaseController<DTO extends BaseDTO, CritereDTO extends BaseCritereDTO>
{
    getItems(pCritereDTO: CritereDTO): Promise<DTO[]>;
    getItem(pCritereDTO: CritereDTO): Promise<DTO>;
    createItem(pDTO: DTO): Promise<DTO>;
    updateItem(pDTO: DTO, pCritereDTO: CritereDTO): Promise<DTO>;
    deleteItem(pCritereDTO: CritereDTO): Promise<boolean>;
    itemExists(pCritereDTO: CritereDTO): Promise<boolean>;
}