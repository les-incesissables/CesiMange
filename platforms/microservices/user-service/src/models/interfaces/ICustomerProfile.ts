import { Document } from 'mongoose';

import { IName } from './IName';
import { IProvider } from './IProvider';
import { IPreferences } from './IPreferences';

export interface ICustomerProfile extends Document {
  user_id: number;
  first_name: string;
  last_name: string;
  profile_picture: string;
  addresses: IName[];
  payment_methods: IProvider[];
  preferences: IPreferences;
  created_at: Date;
  updated_at: Date;
}
