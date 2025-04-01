/**
 * Interface pour les controllers
 */
export interface IBaseMetier<DTO, CritereDTO>
{
    getItems(pCritereDTO: CritereDTO): Promise<DTO[]>;
    getItem(pCritereDTO: CritereDTO): Promise<DTO>;
    createItem(pDTO: DTO): Promise<DTO>;
    updateItem(pDTO: DTO, pCritereDTO: CritereDTO): Promise<DTO>;
    deleteItem(pCritereDTO: CritereDTO): Promise<boolean>;
    itemExists(pCritereDTO: CritereDTO): Promise<boolean>;
}