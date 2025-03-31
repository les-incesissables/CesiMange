import { Document } from 'mongoose';

export interface IRestaurant extends Document {
  name: string;
  description: string;
  menu: Record<string, any>[];
  address: string;
  phone: string;
}
