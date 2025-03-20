import { IBaseRepository } from "./IBaseRepository";
import { BaseCritereDTO } from "../../../models/base/BaseCritereDTO";
import { BaseDTO } from "../../../models/base/BaseDTO";
import { IRepositoryConfig } from "./IRepositoryConfig";
import { Collection, Db, MongoClient, ObjectId } from "mongodb";
import { EDatabaseType } from "../../enums/EDatabaseType";

/**
 * Repository de base g�n�rique pour MongoDB
 * @template DTO - Type de donn�es retourn�/manipul� qui �tend BaseDTO
 * @template CritereDTO - Type des crit�res de recherche qui �tend BaseCritereDTO
 * @author Mahmoud Charif - CESIMANGE-118 - 17/03/2025 - Adaptation pour MongoDB
 */
export abstract class BaseRepository<
  DTO extends BaseDTO,
  CritereDTO extends BaseCritereDTO
> implements IBaseRepository<DTO, CritereDTO>
{
  //#region Attributes
  protected _config: IRepositoryConfig;
  protected _db: Db | undefined;
  protected _collection: Collection | undefined;
  protected _client: MongoClient | undefined;
  //#endregion

  //#region CTOR
  constructor(pConfig: IRepositoryConfig) {
    this._config = pConfig;
  }
  //#endregion

  //#region Methods

  /**
   * M�thode d'initialisation de la connexion MongoDB
   */
  async initialize(): Promise<void> {
    if (this._config.TypeBDD == EDatabaseType.MONGODB) {
      await this.InitMongoDB();
    }

    // TODO Faire la connection poour SQL SERVER
  }

  /**
   * M�thode d'initialisation de la connexion MongoDB avec un commentaire explicatif.
   */
  private async InitMongoDB(): Promise<void> {
    try {
      // V�rifier si la connexion existe d�j�
      if (!this._client) {
        this._client = new MongoClient(this._config.ConnectionString);
        await this._client.connect();
        console.log("Connexion MongoDB �tablie");
      }

      // Initialiser la BD et la collection
      this._db = this._client.db(this._config.DbName);
      this._collection = this._db.collection(this._config.CollectionName);

      console.log(
        `Collection '${this._config.CollectionName}' pr�te � l'emploi`
      );
    } catch (error) {
      console.error("Erreur lors de l'initialisation de MongoDB:", error);
      throw error;
    }
  }

  /**
   * S'assure que la connexion est �tablie avant d'ex�cuter une op�ration
   */
  protected async ensureConnection(): Promise<void> {
    if (!this._collection) {
      await this.initialize();
    }
  }

  //#region CRUD

  /**
   * Obtenir tous les �l�ments selon des crit�res
   * @param pCritereDTO - Crit�res de recherche
   */
  async getItems(pCritereDTO: CritereDTO): Promise<DTO[]> {
    try {
      await this.ensureConnection();

      const lFilter = this.buildFilter(pCritereDTO);
      const lOptions = this.buildOptions(pCritereDTO);

      const lCursor = this._collection!.find(lFilter, lOptions);
      const lResults = await lCursor.toArray();

      return this.formatResults(lResults);
    } catch (error) {
      console.error("Erreur lors de la r�cup�ration des items:", error);
      throw error;
    }
  }

  /**
   * Obtenir un �l�ment par crit�res
   * @param pCritereDTO - Crit�res identifiant l'�l�ment
   */
  async getItem(pCritereDTO: CritereDTO): Promise<DTO> {
    try {
      await this.ensureConnection();

      const lFilter = this.buildFilter(pCritereDTO);

      if (Object.keys(lFilter).length === 0) {
        throw new Error(
          "Au moins un crit�re est requis pour obtenir un �l�ment"
        );
      }

      const lResult = await this._collection!.findOne(lFilter);

      if (!lResult) {
        throw new Error("�l�ment non trouv�");
      }

      return this.formatResults([lResult])[0];
    } catch (error) {
      console.error("Erreur lors de la r�cup�ration de l'item:", error);
      throw error;
    }
  }

  /**
   * Cr�er un nouvel �l�ment
   * @param pDTO - Donn�es pour la cr�ation
   */
  async createItem(pDTO: DTO): Promise<DTO> {
    try {
      await this.ensureConnection();

      // Pr�parer le document
      const lDoc = { ...pDTO } as any;

      // G�rer l'ID correctement
      if (lDoc.id || lDoc.id == undefined) {
        try {
          lDoc._id = new ObjectId(lDoc.id);
        } catch (error) {
          // Si l'ID n'est pas valide, on le supprime pour que MongoDB en g�n�re un
          console.warn("ID non valide pour MongoDB, un nouvel ID sera g�n�r�");
        }
      }
      delete lDoc.id;

      // Ajouter les timestamps
      lDoc.createdAt = new Date();
      lDoc.updatedAt = new Date();

      const lResult = await this._collection!.insertOne(lDoc);

      if (!lResult.acknowledged) {
        throw new Error("�chec de l'insertion du document");
      }

      // Cr�er un objet crit�re pour r�cup�rer l'�l�ment cr��
      const lCritereDTO = {} as CritereDTO;
      lCritereDTO.Id = lResult.insertedId.toString();

      return await this.getItem(lCritereDTO);
    } catch (error) {
      console.error("Erreur lors de la cr�ation de l'item:", error);
      throw error;
    }
  }

  /**
   * Mettre � jour un �l�ment existant
   * @param pDTO - Donn�es pour la mise � jour
   * @param pCritereDTO - Crit�res identifiant l'�l�ment � mettre � jour
   */
  async updateItem(pDTO: DTO, pCritereDTO: CritereDTO): Promise<DTO> {
    try {
      await this.ensureConnection();

      const lFilter = this.buildFilter(pCritereDTO);

      if (Object.keys(lFilter).length === 0) {
        throw new Error("Au moins un crit�re est requis pour la mise � jour");
      }

      // Pr�parer les donn�es � mettre � jour
      const lUpdateData = { ...pDTO } as any;
      delete lUpdateData.id; // Ne pas inclure l'id dans les champs � mettre � jour
      lUpdateData.updatedAt = new Date();

      const lResult = await this._collection!.findOneAndUpdate(
        lFilter,
        { $set: lUpdateData },
        { returnDocument: "after" }
      );

      if (!lResult) {
        throw new Error("L'�l�ment � mettre � jour n'existe pas");
      }

      return this.formatResults([lResult])[0];
    } catch (error) {
      console.error("Erreur lors de la mise � jour de l'item:", error);
      throw error;
    }
  }

  /**
   * Supprimer un �l�ment
   * @param pCritereDTO - Crit�res pour la suppression
   */
  async deleteItem(pCritereDTO: CritereDTO): Promise<boolean> {
    try {
      await this.ensureConnection();

      const lFilter = this.buildFilter(pCritereDTO);

      if (Object.keys(lFilter).length === 0) {
        throw new Error("Au moins un crit�re est requis pour la suppression");
      }

      const lResult = await this._collection!.deleteOne(lFilter);

      return lResult.deletedCount > 0;
    } catch (error) {
      console.error("Erreur lors de la suppression de l'item:", error);
      throw error;
    }
  }

  /**
   * V�rifier si un �l�ment existe selon des crit�res
   * @param pCritereDTO - Crit�res de recherche
   */
  async itemExists(pCritereDTO: CritereDTO): Promise<boolean> {
    try {
      await this.ensureConnection();

      const lFilter = this.buildFilter(pCritereDTO);

      if (Object.keys(lFilter).length === 0) {
        throw new Error(
          "Au moins un crit�re est requis pour v�rifier l'existence"
        );
      }

      const lCount = await this._collection!.countDocuments(lFilter, {
        limit: 1,
      });

      return lCount > 0;
    } catch (error) {
      console.error("Erreur lors de la v�rification de l'existence:", error);
      throw error;
    }
  }
  //#endregion

  //#region Build
  /**
   * Construit les options de requ�te MongoDB (tri, pagination, etc.)
   */
  protected buildOptions(pCritereDTO: CritereDTO): any {
    const lOptions: any = {};

    // Pagination
    if (pCritereDTO.Limit) {
      lOptions.limit = pCritereDTO.Limit;
    }

    if (pCritereDTO.Skip) {
      lOptions.skip = pCritereDTO.Skip;
    }

    // Tri
    if (pCritereDTO.Sort) {
      const sortDirection = pCritereDTO.SortDirection || 1;
      lOptions.sort = { [pCritereDTO.Sort]: sortDirection };
    }

    return lOptions;
  }

  protected buildFilter(pCritereDTO: CritereDTO): any {
    const lFilter: any = {};

    const processFilter = (key: string, value: any, filter: any) => {
      if (value !== undefined && value !== null && value !== "") {
        // Gestion sp�ciale pour l'ID MongoDB
        if (key === "id" || key === "_id") {
          try {
            filter._id = new ObjectId(value as string);
          } catch (error) {
            console.warn("ID non valide pour MongoDB:", value);
          }
        }
        // Gestion des champs "Like"
        else if (key.endsWith("Like") && typeof value === "string") {
          const fieldName = key.replace(/Like$/, ""); // Supprime 'Like'
          const escapedValue = this.escapeRegex(value);
          filter[fieldName] = { $regex: escapedValue, $options: "i" };
        }
        // Gestion des objets imbriqu�s (ex: menuLike)
        else if (typeof value === "object" && !Array.isArray(value)) {
          const fieldName = key.replace(/Like$/, ""); // Supprime 'Like'
          filter[fieldName] = { $elemMatch: this.buildFilter(value) }; // Recherche sur les sous-objets
        }
        // Gestion des tableaux (ex: recherche avec $in)
        else if (Array.isArray(value)) {
          filter[key] = { $in: value };
        }
        // Gestion des tableaux (ex: recherche avec $in)
        else if (Array.isArray(value)) {
          filter[key] = { $in: value };
        }
        // Gestion des dates (recherche par plage de dates)
        else if (this.isDate(value)) {
          filter[key] = { $gte: value };
        }
        // Gestion des autres types (boolean, number, objets)
        else {
          filter[key] = value;
        }
      }
    };

    // Parcourir toutes les propri�t�s de CritereDTO
    for (const [key, value] of Object.entries(pCritereDTO)) {
      processFilter(key, value, lFilter);
    }

    return Object.keys(lFilter).length > 0 ? lFilter : {};
  }
  //#endregion

  //#region Private
  private isDate(dateStr: string) {
    return !isNaN(new Date(dateStr).getDate());
  }
  // Fonction d'�chappement des caract�res sp�ciaux pour les regex
  private escapeRegex(value: string): string {
    return value.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  }

  /**
   * Formate les r�sultats de la base de donn�es en DTOs
   */
  private formatResults(pResults: any[]): DTO[] {
    return pResults.map((lDoc) => {
      // Convertir _id en id pour respecter le format DTO
      const lFormatted: any = { ...lDoc, id: lDoc._id.toString() };
      delete lFormatted._id;
      return lFormatted as DTO;
    });
  }
  //#endregion

  /**
   * Ferme la connexion � la base de donn�es
   */
  async disconnect(): Promise<void> {
    if (this._client) {
      await this._client.close();
      this._client = undefined;
      this._db = undefined;
      this._collection = undefined;
      console.log("Connexion MongoDB ferm�e");
    }
  }

  /**
   * � surcharger dans les classes d�riv�es pour ajouter des conditions sp�cifiques
   */
  protected getAdditionalConditions(pCritereDTO: CritereDTO): any {
    return {};
  }
  //#endregion
}
