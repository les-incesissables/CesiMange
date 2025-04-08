import { INutritionalInfo } from './INutritionalInfo';

export interface IArticles {
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  tags: string[];
  allergens: string[];
  nutritional_info: INutritionalInfo;
  available: boolean;
}
