import { MongoClient, Collection, ObjectId } from "mongodb";
import { ConnectionPool, Request } from "mssql";
/**
 * Gestionnaire de connexions pour partager entre les repositories
 */
export class ConnectionManager
{
    private static instance: ConnectionManager;
    private sqlConnections: Map<string, ConnectionPool> = new Map();
    private mongoClients: Map<string, MongoClient> = new Map();
    private mongoCollections: Map<string, Collection> = new Map();

    private constructor () { }

    public static getInstance(): ConnectionManager
    {
        if (!ConnectionManager.instance)
        {
            ConnectionManager.instance = new ConnectionManager();
        }
        return ConnectionManager.instance;
    }

    /**
     * Obtenir ou créer une connexion SQL Server
     */
    public async getSqlConnection(connectionString: string, database: string): Promise<ConnectionPool>
    {
        const key = `${connectionString}_${database}`;

        if (!this.sqlConnections.has(key))
        {
            const sql = require('mssql');
            const pool = new sql.ConnectionPool({
                server: connectionString,
                database: database,
                options: {
                    trustServerCertificate: true,
                    encrypt: true
                }
            });

            await pool.connect();
            this.sqlConnections.set(key, pool);
        }

        return this.sqlConnections.get(key)!;
    }

    /**
     * Obtenir ou créer une collection MongoDB
     */
    public async getMongoCollection(connectionString: string, database: string, collection: string): Promise<Collection>
    {
        const key = `${connectionString}_${database}_${collection}`;

        if (!this.mongoCollections.has(key))
        {
            const clientKey = connectionString;

            if (!this.mongoClients.has(clientKey))
            {
                const { MongoClient } = require('mongodb');
                const client = new MongoClient(connectionString);
                await client.connect();
                this.mongoClients.set(clientKey, client);
            }

            const client = this.mongoClients.get(clientKey)!;
            const db = client.db(database);
            const coll = db.collection(collection);

            this.mongoCollections.set(key, coll);
        }

        return this.mongoCollections.get(key)!;
    }

    /**
     * Fermer toutes les connexions
     */
    public async closeAll(): Promise<void>
    {
        // Fermer les connexions SQL Server
        for (const pool of this.sqlConnections.values())
        {
            await pool.close();
        }
        this.sqlConnections.clear();

        // Fermer les clients MongoDB
        for (const client of this.mongoClients.values())
        {
            await client.close();
        }
        this.mongoClients.clear();
        this.mongoCollections.clear();
    }
}