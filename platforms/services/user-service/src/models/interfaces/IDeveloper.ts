import { Document } from 'mongoose';

export interface IDeveloper extends Document {
  name: string;
  email: string;
  password: string;
  expertise: string[];
}
