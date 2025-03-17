/**
 * Configuration du repository MongoDB
 */
export interface IRepositoryConfig
{
    /**
     * Chaîne de connexion MongoDB
     * Ex: mongodb://localhost:27017
     */
    connectionString: string;

    /**
     * Nom de la base de données
     */
    dbName: string;

    /**
     * Nom de la collection
     */
    collectionName: string;
}