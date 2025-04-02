import { AuthUsers } from "../../models/entities/authusers/AuthUsers";
import { AuthUsersCritereDTO } from "../../models/entities/authusers/AuthUsersCritereDTO";
import { BaseController } from "../../../../../services/base-classes/src/controllers/base/BaseController";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { AuthJWT } from "../../middleware/authJWT";
import { AuthUsersMetier } from "../../metier/authusers/AuthUsersMetier";

/**
 * Contrôleur pour l'entité AuthUsers
 * @author Controller Generator - 2025-04-01T19:17:50.592Z - Creation
 */
export class AuthUsersController extends BaseController<AuthUsers, AuthUsersCritereDTO>
{
    //#region Attributes
    // Clé secrète pour signer les tokens JWT
    private readonly JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";
    private readonly TOKEN_EXPIRATION = "8h";

    //#endregion

    //#region Methods

    constructor (pMetier: AuthUsersMetier)
    {
        super(pMetier);
    }

    override initializeRoutes(): void
    {
        // Routes publiques
        this.Router.post('/login', this.getItem);
        this.Router.post('/register', this.createItem);

        // Routes protégées pour admin uniquement
        this.Router.get('/admin',
            AuthJWT.authenticateJWT,
            AuthJWT.hasRole('admin'),
            this.adminEndpoint);

        // Routes protégées par propriété de ressource
        this.Router.get('/:id',
            AuthJWT.authenticateJWT,
            AuthJWT.isResourceOwnerOrAdmin((req) => parseInt(req.params.id)),
            this.getItem);

        this.Router.put('/:id',
            AuthJWT.authenticateJWT,
            AuthJWT.isResourceOwnerOrAdmin((req) => parseInt(req.params.id)),
            this.updateItem);

        this.Router.delete('/',
            AuthJWT.authenticateJWT,
            this.deleteItem);
    }

    private adminEndpoint(req: Request, res: Response): void
    {
        res.status(200).json({ message: 'Accès admin accordé', user: req.user });
    }

    //#endregion

    //#region CreateItem
    /**
    * Surchage de la validation du register/CreateItem
    * @param pAuthUsers
    */
    public override async validateCreateItem(pAuthUsers: AuthUsers): Promise<void>
    {
        // cm - Validation des champs
        if (!pAuthUsers.email || !pAuthUsers.password_hash || !pAuthUsers.username)
        {
            throw new Error('Tous les champs sont requis');
        }

        // cm - Crée un critere de recherche par email
        let lAuthUser: AuthUsers = new AuthUsers();
        lAuthUser.email = pAuthUsers.email;

        // cm - Verifie si l'utilisateur/email existe déjà
        const lExistingUser = await this.Metier.getItem(lAuthUser);
        if (lExistingUser && lExistingUser.email)
        {
            throw new Error('Cet utilisateur existe déjà');
        }
    }
    /**
     * Surchage de le beforeCreateItem du register/CreateItem
     * @param pAuthUsers
     */
    public override async beforeCreateItem(pAuthUsers: AuthUsers): Promise<AuthUsers> 
    {
        // cm - Hashe le mot de passe
        const lHashedPassword = await bcrypt.hash(pAuthUsers.password_hash, 10);

        // cm - Cree un nouvel utilisateur
        const lNewUser = new AuthUsers();
        lNewUser.username = pAuthUsers.username;
        lNewUser.password_hash = lHashedPassword;
        lNewUser.email = pAuthUsers.email;
        lNewUser.role = 'user';

        return lNewUser;
    }
    //#endregion

    //#region GetItem
    /**
    * Surchage de la validation du login/GetItem
    * @param pAuthUsers
    */
    public override async validateGetItem(pAuthUsers: AuthUsers): Promise<void>
    {
        // cm - Validation des champs
        if (!pAuthUsers.email || !pAuthUsers.password_hash)
        {
            throw new Error('Email et mot de passe requis');
        }

        let lAuthUsers: AuthUsers = new AuthUsers();
        lAuthUsers.email = pAuthUsers.email;

        // Rechercher l'utilisateur dans la base de données
        const lUser = await this.Metier.getItem(lAuthUsers);

        if (!lUser)
        {
            throw new Error('Identifiants invalides');
        }

        // Vérifier le mot de passe
        const lIsPasswordValid = await bcrypt.compare(pAuthUsers.password_hash, lUser.password_hash);

        if (!lIsPasswordValid)
        {
            throw new Error('Identifiants invalides');
        }
    }

    /**
     * Surchage de le beforeGetItem du login/GetItem
     * @param pAuthUsers
     */
    public override beforeGetItem(pAuthUsers: AuthUsersCritereDTO): AuthUsersCritereDTO
    {
        // cm - Genere le token JWT
        let lCritere: AuthUsersCritereDTO = new AuthUsersCritereDTO();
        lCritere.email = pAuthUsers.email;

        return lCritere;
    }

    /**
     * Surchage de le afterGetItem du login/GetItem
     * @param pAuthUsers
     */
    public override afterGetItem(pAuthUsers: AuthUsers): AuthUsers
    {
        // cm - Genere le token JWT
        const lToken = jwt.sign({
            id: pAuthUsers.auth_user_id,
            username: pAuthUsers.email,
            roles: pAuthUsers.role
        },
            this.JWT_SECRET,
            { expiresIn: this.TOKEN_EXPIRATION }
        );

        pAuthUsers.refresh_token = lToken;

        return pAuthUsers;
    }
    //#endregion

}