'use client';
import React from 'react';
import { IArticles } from '../../models/interfaces/IRestaurant/IArticles';
import ArticleCard from '../Card/ArticleCard';

interface ArticleListProps {
    articles: IArticles[];
    onAddToCart?: () => void;
}

const ArticleList: React.FC<ArticleListProps> = ({ articles }) => {
    return (
        <ul className="flex flex-wrap gap-4">
            {articles.map((article) => (
                <li>
                    <ArticleCard article={article} />
                </li>
            ))}
        </ul>
    );
};

export default ArticleList;
