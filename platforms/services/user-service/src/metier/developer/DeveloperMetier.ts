import { IDeveloper } from "../../models/interfaces/IDeveloper";
import { BaseMetier } from "../base/BaseMetier";


/**
 * M�tier pour l'entit� Developer
 * @Author ModelGenerator - 2025-03-23T15:54:47.649Z - Cr�ation
 */
export class DeveloperMetier extends BaseMetier<IDeveloper, Partial<IDeveloper>> {
    constructor() {
        super('developer');
    }
}
