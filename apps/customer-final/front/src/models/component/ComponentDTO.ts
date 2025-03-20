import { BaseDTO } from "../base/BaseDTO";

/**
 * DTO pour l'entité Component
 * @Author ModelGenerator - 2025-03-19T20:54:38.011Z - Création
 */
export class ComponentDTO extends BaseDTO {
  name?: string;
  description?: string;
  version?: string;
  tags?: string[];
}
