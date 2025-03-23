import { ComponentDTO } from "../../models/component/ComponentDTO";
import { ComponentCritereDTO } from "../../models/component/ComponentCritereDTO";
import { BaseMetier } from "../base/BaseMetier";

/**
 * M�tier pour l'entit� Component
 * @Author ModelGenerator - 2025-03-23T15:27:54.033Z - Cr�ation
 */
export class ComponentMetier extends BaseMetier<ComponentDTO, ComponentCritereDTO> {
    constructor() {
        super('component');
    }
}
