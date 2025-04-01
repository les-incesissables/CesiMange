import { AuthUsers } from "../../models/entities/authusers/AuthUsers";
import { AuthUsersCritereDTO } from "../../models/entities/authusers/AuthUsersCritereDTO";
import { BaseController } from "../../../../../services/base-classes/src/controllers/base/BaseController";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

/**
 * Contrôleur pour l'entité AuthUsers
 * @author Controller Generator - 2025-04-01T19:17:50.592Z - Creation
 */
export class AuthUsersController extends BaseController<AuthUsers, AuthUsersCritereDTO>
{

    // Clé secrète pour signer les tokens JWT
    private readonly JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";
    private readonly TOKEN_EXPIRATION = "8h";

    override initializeRoutes(): void
    {
        // cm - Routes publiques
        this.Router.post('/login', this.login.bind(this));
        this.Router.post('/register', this.register.bind(this));

        // cm - Routes protégées
        this.Router.get('/', this.authenticateJWT.bind(this), this.getAllItems.bind(this));
        this.Router.get('/:id', this.authenticateJWT.bind(this), this.getItem.bind(this));
        this.Router.put('/:id', this.authenticateJWT.bind(this), this.updateItem.bind(this));
        this.Router.delete('/:id', this.authenticateJWT.bind(this), this.deleteItem.bind(this));
    }

    /**
     * Middleware pour authentifier les requêtes avec JWT
     * @author Mahmoud Charif - 01/03/2025 - CESIMANGE-70 - Creation
     */
    private authenticateJWT(req: Request, res: Response, next: NextFunction): void
    {
        const authHeader = req.headers.authorization;

        if (!authHeader)
        {
            return res.status(401).json({ message: 'Token d\'authentification manquant' });
        }

        const token = authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

        jwt.verify(token, this.JWT_SECRET, (err, user) =>
        {
            if (err)
            {
                return res.status(403).json({ message: 'Token invalide ou expiré' });
            }

            // Ajouter l'utilisateur décodé à l'objet de requête
            req.user = user;
            next();
        });
    }

    /**
     * Authentification d'un utilisateur
     * @author Mahmoud Charif - 01/03/2025 - CESIMANGE-70 - Creation
     */
    private async login(pReq: Request, pRes: Response): Promise<void>
    {
        try
        {
            const { lEmail, lPassword } = pReq.body;

            if (!lEmail || !lPassword)
            {
                pRes.status(400).json({ message: 'Nom d\'utilisateur et mot de passe requis' });
                return;
            }

            let lAuthUsers: AuthUsers = new AuthUsers();
            lAuthUsers.email = lEmail;

            // Rechercher l'utilisateur dans la base de données
            const lUser = await this.Metier.getItem(lAuthUsers);

            if (!lUser)
            {
                pRes.status(401).json({ message: 'Identifiants invalides' });
                return;
            }

            // Vérifier le mot de passe
            const lIsPasswordValid = await bcrypt.compare(lPassword, lUser.password_hash);

            if (!lIsPasswordValid)
            {
                pRes.status(401).json({ message: 'Identifiants invalides' });
                return;
            }

            // cm - Genere le token JWT
            const token = jwt.sign(
                {
                    id: lUser.id,
                    username: lUser.email,
                    roles: lUser.role
                },
                this.JWT_SECRET,
                { expiresIn: this.TOKEN_EXPIRATION }
            );

            pRes.status(200).json({
                token,
                user: {
                    id: lUser.id,
                    username: lUser.email,
                }
            });
        } catch (error)
        {
            console.error('Erreur lors de la connexion:', error);
            pRes.status(500).json({ message: 'Erreur lors de la connexion' });
        }
    }

    /**
     * Inscription d'un nouvel utilisateur
     */
    private async register(req: Request, res: Response): Promise<void>
    {
        try
        {
            const { username, password, email } = req.body;

            if (!username || !password || !email)
            {
                res.status(400).json({ message: 'Tous les champs sont requis' });
                return;
            }

            let lAuthUser: AuthUsers = new AuthUsers();
            lAuthUser.email = email;

            // Vérifier si l'utilisateur existe déjà
            const existingUser = await this.Metier.getItem(lAuthUser);
            if (existingUser)
            {
                res.status(409).json({ message: 'Cet utilisateur existe déjà' });
                return;
            }

            // Hasher le mot de passe
            const hashedPassword = await bcrypt.hash(password, 10);

            // Créer un nouvel utilisateur
            const newUser = new AuthUsers();
            newUser. = username;
            newUser.password = hashedPassword;
            newUser.email = email;
            newUser.roles = ['user']; // Rôle par défaut

            // Sauvegarder l'utilisateur
            const savedUser = await this.Service.create(newUser);

            res.status(201).json({
                message: 'Utilisateur créé avec succès',
                user: {
                    id: savedUser.id,
                    username: savedUser.username,
                    email: savedUser.email
                }
            });
        } catch (error)
        {
            console.error('Erreur lors de l\'inscription:', error);
            res.status(500).json({ message: 'Erreur lors de l\'inscription' });
        }
    }
}