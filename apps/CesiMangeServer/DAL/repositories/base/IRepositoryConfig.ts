/**
 * Configuration du repository
 */

export interface IRepositoryConfig {
    connectionString: string;
    collection?: string; // Pour MongoDB
    table?: string; // Pour SQL
}
