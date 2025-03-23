import { EDatabaseType } from "../enums/EDatabaseType";

/**
 * Configuration du repository MongoDB
 */
export interface IRepositoryConfig
{
    /**
     * Chaîne de connexion MongoDB
     * Ex: mongodb://localhost:27017
     */
    ConnectionString: string;

    /**
     * Nom de la base de données
     */
    DbName: string;

    /**
     * Nom de la collection
     */
    CollectionName: string;

    /*
    *
    */
    TypeBDD: EDatabaseType;
}