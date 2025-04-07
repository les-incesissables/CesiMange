import React from 'react';
import ArticleCard, { Article } from '../Card/ArticleCard';

interface ProductListProps {
    articles: Article[];
    onAddToCart?: (article: Article) => void;
}

const ProductList: React.FC<ProductListProps> = ({ articles, onAddToCart }) => {
    return (
        <ul className="flex flex-wrap gap-4">
            {articles.map((article) => (
                <li key={article.id}>
                    <ArticleCard article={article} onAdd={() => onAddToCart && onAddToCart(article)} />
                </li>
            ))}
        </ul>
    );
};

export default ProductList;
