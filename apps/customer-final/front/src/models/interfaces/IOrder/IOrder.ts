import { IItems } from './IItems';
import { IDeliveryAddress } from './IDeliveryAddress';
import { ITracking } from './ITracking';

export interface IOrder {
  _id: string;
  customer_id: number;
  restaurant_id: string;
  driver_id: number;
  items: IItems[];
  subtotal: number;
  tax: number;
  delivery_fee: number;
  tip: number;
  total: number;
  status: string;
  payment_status: string;
  payment_method: string;
  transaction_id: number;
  delivery_address: IDeliveryAddress;
  estimated_delivery_time: Date;
  actual_delivery_time: Date;
  tracking: ITracking[];
  created_at: Date;
  updated_at: Date;
}
