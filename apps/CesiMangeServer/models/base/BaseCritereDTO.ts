import { IBaseCritereDTO } from "../../interfaces/IBaseCritereDTO";

/**
 * Crit�res de base dont h�ritent tous les CritereDTOs
 * @author Mahmoud Charif - CESIMANGE-118 - 17/03/2025 - Creation
 */
export abstract class BaseCritereDTO implements IBaseCritereDTO
{
    //#region Properties
    Id?: string;
    Ids?: string[];
    Search?: string;
    Page?: number;
    PageSize?: number;
    Sort?: string;
    SortDirection?: "asc" | "desc";
    IncludeDeleted?: boolean;
    Limit: number;
    Skip?: number;
    //#endregion
}