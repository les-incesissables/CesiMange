export interface IPaymentMethodsItem {
  provider: string;
  last_four: string;
  expiry_date: string;
  card_type: string;
  token: string;
  is_default: boolean;
}
