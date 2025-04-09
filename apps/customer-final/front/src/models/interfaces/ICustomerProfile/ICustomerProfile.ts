import { IAddresses } from './IAddresses';
import { IPaymentMethods } from './IPaymentMethods';
import { IPreferences } from './IPreferences';
import { IFavories } from './IFavories';

export interface ICustomerProfile {
  _id: string;
  user_id?: number;
  first_name: string;
  last_name: string;
  profile_picture: string;
  addresses: IAddresses[];
  payment_methods: IPaymentMethods[];
  preferences: IPreferences;
  created_at?: Date;
  updated_at?: Date;
  favories: IFavories[];
  createdAt?: Date;
  updatedAt?: Date;
}
