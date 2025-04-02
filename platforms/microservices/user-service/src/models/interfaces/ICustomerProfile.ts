import { Document } from 'mongoose';

export interface ICustomerProfile extends Document {
  user_id: number;
  first_name: string;
  last_name: string;
  profile_picture: string;
  addresses: Record<string, any>[];
  payment_methods: Record<string, any>[];
  preferences: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}
