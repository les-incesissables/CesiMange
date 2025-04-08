import { INotifications } from './INotifications';

export interface IPreferences {
  favorite_cuisines: string[];
  dietary_restrictions: string[];
  notifications: INotifications;
}
