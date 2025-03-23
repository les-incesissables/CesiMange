/**
 * DTO pour l'entit� Restaurant
 * @Author ModelGenerator - 2025-03-23T12:56:17.843Z - Cr�ation
 */
export class RestaurantDTO {
  id?: string;
  name: string;
  description: string;
  menu: Record<string, any>[];
  address: string;
  phone: string;
}
