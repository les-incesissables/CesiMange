import { IArticles } from './IArticles';

export interface IMenu {
  name: string;
  categorie: string;
  price: number;
  image: string;
  articles: IArticles[];
}
