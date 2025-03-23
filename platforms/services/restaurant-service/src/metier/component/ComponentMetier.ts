import { IComponent } from "../../models/interfaces/IComponent";
import { BaseMetier } from "../base/BaseMetier";


/**
 * M�tier pour l'entit� Component
 * @Author ModelGenerator - 2025-03-23T15:54:47.670Z - Cr�ation
 */
export class ComponentMetier extends BaseMetier<IComponent, Partial<IComponent>> {
    constructor() {
        super('component');
    }
}
