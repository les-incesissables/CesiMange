import { MenuDTO } from "../../models/menu/MenuDTO";
import { MenuCritereDTO } from "../../models/menu/MenuCritereDTO";
import { BaseMetier } from "../base/BaseMetier";

/**
 * M�tier pour l'entit� Menu
 * @Author ModelGenerator - 2025-03-21T10:03:28.143Z - Cr�ation
 */
export class MenuMetier extends BaseMetier<MenuDTO, MenuCritereDTO> {
    constructor() {
        super('menu');
    }
}