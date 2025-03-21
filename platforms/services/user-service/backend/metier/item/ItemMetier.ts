import { ItemDTO } from "../../models/item/ItemDTO";
import { ItemCritereDTO } from "../../models/item/ItemCritereDTO";
import { BaseMetier } from "../base/BaseMetier";

/**
 * M�tier pour l'entit� Item
 * @Author ModelGenerator - 2025-03-21T10:03:28.140Z - Cr�ation
 */
export class ItemMetier extends BaseMetier<ItemDTO, ItemCritereDTO> {
    constructor() {
        super('item');
    }
}