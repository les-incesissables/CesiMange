import { BaseDTO } from "../base/BaseDTO";

/**
 * DTO pour l'entit� Component
 */
export class ComponentDTO extends BaseDTO {
  name?: string;
  description?: string;
  version?: string;
  tags?: string[];
}
