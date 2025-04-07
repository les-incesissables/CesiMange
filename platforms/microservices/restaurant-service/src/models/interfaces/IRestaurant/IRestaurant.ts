import { Document } from 'mongoose';

import { ILocation } from './ILocation';
import { IHours } from './IHours';
import { IDeliveryOptions } from './IDeliveryOptions';

export interface IRestaurant extends Document {
  name: string;
  description: string;
  location: ILocation;
  cuisine_types: string[];
  phone: string;
  website: string;
  hours: IHours;
  owner_id: number;
  status: string;
  rating: number;
  delivery_options: IDeliveryOptions;
  created_at: Date;
  updated_at: Date;
  updatedAt?: Date;
  banniere: string;
  logo: string;
}
