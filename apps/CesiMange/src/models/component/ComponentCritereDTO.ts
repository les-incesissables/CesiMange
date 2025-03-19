import { BaseCritereDTO } from "../base/BaseCritereDTO";

/**
 * Crit�res de recherche pour l'entit� Component
 * @Author ModelGenerator - 2025-03-19T20:54:38.012Z - Cr�ation
 */
export class ComponentCritereDTO extends BaseCritereDTO {
  name?: string;
  nameLike?: string;
  description?: string;
  descriptionLike?: string;
  version?: string;
  versionLike?: string;
  tags?: string[];
  tagsLike?: string[];
}
