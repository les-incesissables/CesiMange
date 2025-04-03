import { AuthUsers } from "../../models/entities/authusers/AuthUsers";
import { AuthUsersCritereDTO } from "../../models/entities/authusers/AuthUsersCritereDTO";
import { BaseController } from "../../../../../services/base-classes/src/controllers/base/BaseController";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";

import { AuthUsersMetier } from "../../metier/authusers/AuthUsersMetier";

/**
 * Contrôleur pour l'entité AuthUsers
 * @author Controller Generator - 2025-04-01T19:17:50.592Z - Creation
 * @modified - 02/04/2025 - Implémentation de la sécurité JWT+CSRF avec AuthJWT
 */
export class AuthUsersController extends BaseController<AuthUsers, AuthUsersCritereDTO>
{
    
}