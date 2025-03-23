import { model } from 'mongoose';
import { IRestaurant } from '../interfaces/IRestaurant';
import { restaurantSchema } from '../schemas/restaurantSchema';

export const Restaurant = model<IRestaurant>('Restaurant', restaurantSchema);
