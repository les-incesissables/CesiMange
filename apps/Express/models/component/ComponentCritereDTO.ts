import { BaseCritereDTO } from "../base/BaseCritereDTO";

/**
 * Crit�res de recherche pour l'entit� Component
 * @Author ModelGenerator - 2025-03-18T11:10:29.394Z - Cr�ation
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
