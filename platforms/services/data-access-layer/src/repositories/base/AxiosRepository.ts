import { AbstractDbRepository } from "./AbstractDbRepository";
import { IRepositoryConfig } from "../../interfaces/IRepositoryConfig";
import { BaseCritereDTO } from "../../models/base/BaseCritereDTO";
import axios, { AxiosInstance } from "axios";

/**
 * Repository pour la communication HTTP avec d'autres microservices via Axios
 * @template DTO - Type de données retourné/manipulé
 * @template CritereDTO - Type des critères de recherche qui étend BaseCritereDTO
 */
export class AxiosRepository<DTO, CritereDTO extends BaseCritereDTO> extends AbstractDbRepository<DTO, CritereDTO>
{
    // Les méthodes buildFilter et formatResults sont gardées vides
    buildFilter(pCritereDTO: CritereDTO): any { return pCritereDTO; }
    formatResults(pResults: any[] | any): DTO[] { return Array.isArray(pResults) ? pResults : pResults.items || []; }

    //#region Attributes
    protected _client!: AxiosInstance;
    protected _isConnected: boolean = false;
    protected _apiConfig: IRepositoryConfig;
    protected _resourcePath: string;
    //#endregion

    //#region CTOR
    /**
     * Constructeur du repository Axios
     * @param pConfig Configuration du repository pour les microservices
     */
    constructor (pConfig: IRepositoryConfig)
    {
        super(pConfig);
        this._apiConfig = pConfig;
        this._resourcePath = pConfig.CollectionName.toLowerCase();
    }
    //#endregion

    //#region Connection Methods
    /**
     * Initialise la connexion HTTP
     */
    public async initialize(): Promise<void>
    {
        try
        {
            if (!this._isConnected)
            {
                this._client = axios.create({
                    baseURL: this._apiConfig.baseURL,
                    timeout: this._apiConfig.timeout || 30000,
                    headers: {
                        'Content-Type': 'application/json',
                        ...(this._apiConfig.headers || {})
                    }
                });

                this.setupInterceptors();
                this._isConnected = true;
                console.log(`AxiosRepository pour '${this._config.CollectionName}' initialisé avec l'URL de base: ${this._apiConfig.baseURL}`);
            }
        } catch (error)
        {
            console.error("Erreur lors de l'initialisation du client Axios:", error);
            throw error;
        }
    }

    /**
     * Configure les intercepteurs pour le client Axios
     */
    protected setupInterceptors(): void
    {
        this._client.interceptors.request.use(
            (config) =>
            {
                const token = process.env.API_TOKEN;
                if (token)
                {
                    config.headers = config.headers || {};
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) =>
            {
                console.error("Erreur dans l'intercepteur de requête:", error);
                return Promise.reject(error);
            }
        );

        this._client.interceptors.response.use(
            (response) => response,
            (error) =>
            {
                console.error(`Erreur de réponse API pour ${this._config.CollectionName}:`,
                    error.response?.status || error.message);
                return Promise.reject(error);
            }
        );
    }

    /**
     * S'assure que la connexion est établie avant d'exécuter une opération
     */
    protected async ensureConnection(): Promise<AxiosInstance>
    {
        if (!this._isConnected)
        {
            await this.initialize();
        }
        return this._client;
    }

    /**
     * Déconnecte le repository (méthode de compatibilité)
     */
    async disconnect(): Promise<void>
    {
        this._isConnected = false;
        console.log(`AxiosRepository pour '${this._config.CollectionName}' déconnecté`);
    }
    //#endregion

    //#region CRUD Operations
    /**
     * Récupère plusieurs éléments selon les critères
     * @param pCritereDTO - Critères de recherche
     * @returns Liste d'éléments correspondant aux critères
     */
    async getItems(pCritereDTO: CritereDTO): Promise<DTO[]>
    {
        try
        {
            const client = await this.ensureConnection();
            const response = await client.get(`/${this._resourcePath}`, { params: pCritereDTO });
            return response.data;
        } catch (error)
        {
            console.error(`Erreur lors de la récupération des éléments depuis ${this._resourcePath}:`, error);
            throw error;
        }
    }

    /**
     * Récupère un élément spécifique selon les critères
     * @param pCritereDTO - Critères de recherche
     * @returns Élément correspondant aux critères
     */
    async getItem(pCritereDTO: CritereDTO): Promise<DTO>
    {
        try
        {
            const client = await this.ensureConnection();

            if (pCritereDTO.id)
            {
                const response = await client.get(`/${this._resourcePath}/${pCritereDTO.id}`);
                return response.data;
            }

            const response = await client.get(`/${this._resourcePath}/find`, { params: pCritereDTO });
            return response.data;
        } catch (error)
        {
            console.error(`Erreur lors de la récupération de l'élément depuis ${this._resourcePath}:`, error);
            throw error;
        }
    }

    /**
     * Crée un nouvel élément
     * @param pDTO - Données pour la création
     * @returns Élément créé
     */
    async createItem(pDTO: DTO): Promise<DTO>
    {
        try
        {
            const client = await this.ensureConnection();
            const response = await client.post(`/${this._resourcePath}`, pDTO);
            return response.data;
        } catch (error)
        {
            console.error(`Erreur lors de la création de l'élément dans ${this._resourcePath}:`, error);
            throw error;
        }
    }

    /**
     * Met à jour un élément selon les critères
     * @param pDTO - Données pour la mise à jour
     * @param pCritereDTO - Critères pour identifier l'élément à mettre à jour
     * @returns Élément mis à jour
     */
    async updateItem(pDTO: DTO, pCritereDTO: CritereDTO): Promise<DTO>
    {
        try
        {
            const client = await this.ensureConnection();

            if (pCritereDTO.id)
            {
                const response = await client.put(`/${this._resourcePath}/${pCritereDTO.id}`, pDTO);
                return response.data;
            }

            const response = await client.put(`/${this._resourcePath}`, pDTO, { params: pCritereDTO });
            return response.data;
        } catch (error)
        {
            console.error(`Erreur lors de la mise à jour de l'élément dans ${this._resourcePath}:`, error);
            throw error;
        }
    }

    /**
     * Supprime un élément selon les critères
     * @param pCritereDTO - Critères pour identifier l'élément à supprimer
     * @returns True si supprimé avec succès, false sinon
     */
    async deleteItem(pCritereDTO: CritereDTO): Promise<boolean>
    {
        try
        {
            const client = await this.ensureConnection();

            if (pCritereDTO.id)
            {
                const response = await client.delete(`/${this._resourcePath}/${pCritereDTO.id}`);
                return response.status >= 200 && response.status < 300;
            }

            const response = await client.delete(`/${this._resourcePath}`, { params: pCritereDTO });
            return response.status >= 200 && response.status < 300;
        } catch (error)
        {
            console.error(`Erreur lors de la suppression de l'élément dans ${this._resourcePath}:`, error);
            throw error;
        }
    }

    /**
     * Vérifie si un élément existe selon les critères
     * @param pCritereDTO - Critères de recherche
     * @returns True si l'élément existe, false sinon
     */
    async itemExists(pCritereDTO: CritereDTO): Promise<boolean>
    {
        try
        {
            const client = await this.ensureConnection();

            let url = `/${this._resourcePath}/exists`;
            if (pCritereDTO.id)
            {
                url = `/${this._resourcePath}/${pCritereDTO.id}/exists`;
            }

            const response = await client.get(url, { params: pCritereDTO });

            if (typeof response.data === 'boolean')
            {
                return response.data;
            }
            return response.data?.exists === true;
        } catch (error)
        {
            if (axios.isAxiosError(error) && error.response?.status === 404)
            {
                return false;
            }
            console.error(`Erreur lors de la vérification de l'existence de l'élément dans ${this._resourcePath}:`, error);
            throw error;
        }
    }
    //#endregion
}