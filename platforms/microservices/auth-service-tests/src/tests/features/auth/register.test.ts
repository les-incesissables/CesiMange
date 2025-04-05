// tests/features/auth/register.test.ts
import 'reflect-metadata';
import request from 'supertest';
import express from 'express';
import { AuthUsersController } from '../../../../../auth-service/src/controllers/authusers/AuthUsersController';
import { AuthUsersMetier } from '../../../../../auth-service/src/metier/authusers/AuthUsersMetier';
import { AuthUsers } from '../../../../../auth-service/src/models/entities/authusers/AuthUsers';

// Mock du service métier
jest.mock('../../../../../auth-service/src/metier/authusers/AuthUsersMetier');

describe('Fonctionnalité d\'inscription', () =>
{
    let app: express.Application;
    let authUsersMetier: jest.Mocked<AuthUsersMetier>;
    let authUsersController: AuthUsersController;

    beforeEach(() =>
    {
        // Réinitialiser les mocks entre les tests
        jest.clearAllMocks();

        // Créer une nouvelle instance d'Express pour chaque test
        app = express();
        app.use(express.json());

        // Initialiser le mock pour AuthUsersMetier
        authUsersMetier = new AuthUsersMetier() as jest.Mocked<AuthUsersMetier>;
        authUsersController = new AuthUsersController(authUsersMetier);

        // Configurer les routes pour les tests
        app.use('/auth', authUsersController.getRouter() as unknown as express.RequestHandler);
    });

    it('devrait créer un nouvel utilisateur avec succès', async () =>
    {
        // Préparer les données utilisateur et la réponse attendue
        const userData: Partial<AuthUsers> = {
            email: 'test@example.com',
            password_hash: 'Password123!',
            username: 'testuser'
        };

        const createdUser: Partial<AuthUsers> = {
            id: 1,
            email: userData.email,
            username: userData.username,
            created_at: new Date()
        };

        // Mock de la méthode createItem
        (authUsersMetier.createItem as jest.Mock).mockResolvedValue(createdUser);

        // Exécuter la requête
        const response = await request(app)
            .post('/auth/register')
            .send(userData)
            .expect(201);

        // Vérifications
        expect(response.body.id).toBe(createdUser.id);
        expect(response.body.role).toBeTruthy();
    });
});