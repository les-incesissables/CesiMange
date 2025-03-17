import { Router, Request, Response } from "express";
import { BaseMetier } from "../metier/base/BaseMetier";
import { BaseDTO } from "../models/base/BaseDTO";
import { BaseCritereDTO } from "../models/base/BaseCritereDTO";

export class BaseController<DTO extends BaseDTO, CritereDTO extends BaseCritereDTO>
{
    private router: Router;
    private metier: BaseMetier<DTO, CritereDTO>;

    constructor (metier: BaseMetier<DTO, CritereDTO>)
    {
        this.router = Router();
        this.metier = metier;
        this.initializeRoutes();
    }

    private initializeRoutes(): void
    {
        // GET / - Récupérer tous les éléments
        this.router.get('/', this.getAllItems);

        // GET /:id - Récupérer un élément par son ID
        this.router.get('/:id', this.getItemById);

        // POST / - Créer un nouvel élément
        this.router.post('/', this.createItem);

        // PUT /:id - Mettre à jour un élément existant
        this.router.put('/:id', this.updateItem);

        // DELETE /:id - Supprimer un élément
        this.router.delete('/:id', this.deleteItem);
    }

    protected getAllItems = async (req: Request, res: Response): Promise<void> =>
    {
        try
        {
            const critere = req.body as CritereDTO;
            const items = await this.metier.getItems(critere);
            res.status(200).json(items);
        } catch (error)
        {
            res.status(500).json({ error: error instanceof Error ? error.message : "Une erreur inconnue est survenue" });
        }
    };

    protected getItemById = async (req: Request, res: Response): Promise<void> =>
    {
        try
        {
            const critere = { id: req.params.id } as unknown as CritereDTO; // Récupérer l'ID depuis les paramètres de la route
            const item = await this.metier.getItem(critere);
            item ? res.status(200).json(item) : res.status(404).json({ error: "Élément non trouvé" });
        } catch (error)
        {
            res.status(500).json({ error: error instanceof Error ? error.message : "Une erreur inconnue est survenue" });
        }
    };

    protected createItem = async (req: Request, res: Response): Promise<void> =>
    {
        try
        {
            const itemDTO = req.body as DTO; // Récupérer les données depuis le body de la requête
            const createdItem = await this.metier.createItem(itemDTO);
            res.status(201).json(createdItem);
        } catch (error)
        {
            res.status(400).json({ error: error instanceof Error ? error.message : "Données invalides" });
        }
    };

    protected updateItem = async (req: Request, res: Response): Promise<void> =>
    {
        try
        {
            const itemDTO = req.body as DTO; // Récupérer les données depuis le body de la requête
            const critere = { id: req.params.id } as unknown as CritereDTO; // Récupérer l'ID depuis les paramètres de la route
            const updatedItem = await this.metier.updateItem(itemDTO, critere);
            res.status(200).json(updatedItem);
        } catch (error)
        {
            res.status(400).json({ error: error instanceof Error ? error.message : "Données invalides" });
        }
    };

    protected deleteItem = async (req: Request, res: Response): Promise<void> =>
    {
        try
        {
            const critere = { id: req.params.id } as unknown as CritereDTO; // Récupérer l'ID depuis les paramètres de la route
            const success = await this.metier.deleteItem(critere);
            success ? res.status(204).send() : res.status(404).json({ error: "Élément non trouvé" });
        } catch (error)
        {
            res.status(500).json({ error: error instanceof Error ? error.message : "Une erreur inconnue est survenue" });
        }
    };

    public getRouter(): Router
    {
        return this.router;
    }
}