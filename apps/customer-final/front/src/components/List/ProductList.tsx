import React from 'react';
import ArticleCard from '../Card/ArticleCard';
import { IArticles } from '../../models/interfaces/IRestaurant/IArticles';

interface ProductListProps {
    articles: IArticles[];
    onAddToCart?: () => void;
}

const ProductList: React.FC<ProductListProps> = ({ articles, onAddToCart }) => {
    return (
        <ul className="flex flex-wrap gap-4">
            {articles.map((article) => (
                <li>
                    <ArticleCard article={article} onAdd={() => onAddToCart} />
                </li>
            ))}
        </ul>
    );
};

export default ProductList;
