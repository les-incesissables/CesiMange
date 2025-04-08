// request-resolver-service/src/middlewares/security.middleware.ts

import helmet from "helmet";
import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import { AuthJWT } from "../utils/authJWT";

/**
 * Middleware pour authentifier les requ�tes avec JWT et CSRF token
 * Le JWT est r�cup�r� depuis le cookie HttpOnly et le CSRF token depuis l'en-t�te
 */
export function checkId(req: Request, res: Response)
{
    try
    {
        // cm - R�cup�rer le JWT depuis le cookie
        const lJwtToken = req.cookies.access_token;

        if (!lJwtToken)
        {
            return res.status(401).json({ message: 'JWT manquant dans les cookies' });
        }

        // 2. V�rifier et d�coder le JWT
        const lSession = AuthJWT.verifyToken(lJwtToken);

        if (!lSession)
        {
            return res.status(403).json({ message: 'JWT invalide ou expir�' });
        }

        if (req.body.id != lSession.id)
        {
            return res.status(403).json({ message: 'Acc�s refus�e' });
        }

    } catch (error)
    {
        console.error('Erreur d\'authentification:', error);
        return res.status(500).json({ message: 'Erreur interne d\'authentification' });
    }
};