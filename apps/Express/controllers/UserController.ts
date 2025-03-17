import { Router, Request, Response } from "express"; // Ajout de Request et Response
import { UserCritereDTO } from "../models/user/UserCritereDTO";
import { UserDTO } from "../models/user/UserDTO";

import { BaseController } from "./BaseController";

// Contrôleur User
export class UserController extends BaseController<UserDTO,UserCritereDTO>
{
}