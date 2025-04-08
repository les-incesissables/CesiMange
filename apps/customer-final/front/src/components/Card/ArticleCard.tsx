'use client';
import React from 'react';
import { IArticles } from '../../models/interfaces/IRestaurant/IArticles';

interface ArticleCardProps
{
    article: IArticles;
    onAdd?: () => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onAdd }) =>
{
    return (
        <div className="w-44 p-5 bg-white rounded-[20px] inline-flex flex-col justify-start items-center gap-4 overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
            <img className="w-32 h-32 rounded-[20px] object-cover" src={'/images/articles/' + article.image} alt={article.name} />
            <div className="w-full flex flex-col items-center gap-2">
                <div className="text-black text-base font-normal font-['Inter'] leading-snug underline text-center">{article.name}</div>
                <div className="w-full flex items-center justify-between">
                    <div className="text-black text-base font-normal font-['Inter']">{article.price} €</div>
                    <button
                        onClick={onAdd}
                        data-state="Default"
                        className="h-8 w-8 bg-lime-500 hover:bg-lime-800 rounded-full flex justify-center items-center transition-colors duration-200"
                    >
                        <span className="text-white text-base font-bold font-['Inter']">+</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ArticleCard;
