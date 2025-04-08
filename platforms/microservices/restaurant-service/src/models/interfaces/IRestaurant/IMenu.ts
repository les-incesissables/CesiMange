import { IArticles } from './IArticles';

export interface IMenu {
  name: string;
  categorie: string;
  articles: IArticles[];
}
