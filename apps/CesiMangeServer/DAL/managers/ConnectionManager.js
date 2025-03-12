"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionManager = void 0;
/**
 * Gestionnaire de connexions pour partager entre les repositories
 */
class ConnectionManager {
    constructor() {
        this.sqlConnections = new Map();
        this.mongoClients = new Map();
        this.mongoCollections = new Map();
    }
    static getInstance() {
        if (!ConnectionManager.instance) {
            ConnectionManager.instance = new ConnectionManager();
        }
        return ConnectionManager.instance;
    }
    /**
     * Obtenir ou cr�er une connexion SQL Server
     */
    getSqlConnection(connectionString, database) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = `${connectionString}_${database}`;
            if (!this.sqlConnections.has(key)) {
                const sql = require('mssql');
                const pool = new sql.ConnectionPool({
                    server: connectionString,
                    database: database,
                    options: {
                        trustServerCertificate: true,
                        encrypt: true
                    }
                });
                yield pool.connect();
                this.sqlConnections.set(key, pool);
            }
            return this.sqlConnections.get(key);
        });
    }
    /**
     * Obtenir ou cr�er une collection MongoDB
     */
    getMongoCollection(connectionString, database, collection) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = `${connectionString}_${database}_${collection}`;
            if (!this.mongoCollections.has(key)) {
                const clientKey = connectionString;
                if (!this.mongoClients.has(clientKey)) {
                    const { MongoClient } = require('mongodb');
                    const client = new MongoClient(connectionString);
                    yield client.connect();
                    this.mongoClients.set(clientKey, client);
                }
                const client = this.mongoClients.get(clientKey);
                const db = client.db(database);
                const coll = db.collection(collection);
                this.mongoCollections.set(key, coll);
            }
            return this.mongoCollections.get(key);
        });
    }
    /**
     * Fermer toutes les connexions
     */
    closeAll() {
        return __awaiter(this, void 0, void 0, function* () {
            // Fermer les connexions SQL Server
            for (const pool of this.sqlConnections.values()) {
                yield pool.close();
            }
            this.sqlConnections.clear();
            // Fermer les clients MongoDB
            for (const client of this.mongoClients.values()) {
                yield client.close();
            }
            this.mongoClients.clear();
            this.mongoCollections.clear();
        });
    }
}
exports.ConnectionManager = ConnectionManager;
//# sourceMappingURL=ConnectionManager.js.map