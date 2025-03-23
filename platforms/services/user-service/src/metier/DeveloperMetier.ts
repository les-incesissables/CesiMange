import { IDeveloper } from "../models/interfaces/IDeveloper";
import { developerSchema } from "../models/schemas/developerSchema";
import { BaseMetier } from "./base/BaseMetier";

/**
 * M�tier pour l'entit� Developer
 * @Author ModelGenerator - 2025-03-23T13:08:52.337Z - Cr�ation
 */
export class DeveloperMetier extends BaseMetier<IDeveloper, Partial<IDeveloper>>
{
    constructor ()
    {
        super('developer');
    }
}
