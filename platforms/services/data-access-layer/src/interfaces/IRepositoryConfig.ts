import { EDatabaseType } from '../interfaces/enums/EDatabaseType';

/**
 * Configuration du repository MongoDB
 */
export interface IRepositoryConfig {
    /**
     * Cha�ne de connexion MongoDB
     * Ex: mongodb://localhost:27017
     */
    ConnectionString: string;

    /**
     * Nom de la base de donn�es
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
