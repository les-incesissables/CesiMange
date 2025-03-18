import { Router, Request, Response } from "express"; // Ajout de Request et Response
import { UserCritereDTO } from "../models/user/UserCritereDTO";
import { UserDTO } from "../models/user/UserDTO";

import { BaseController } from "./BaseController";
import { RestaurantDTO } from "../models/restaurant/RestaurantDTO";
import { RestaurantCritereDTO } from "../models/restaurant/RestaurantCritereDTO";

// Contrôleur User
export class RestaurantController extends BaseController<RestaurantDTO, RestaurantCritereDTO>
{
}