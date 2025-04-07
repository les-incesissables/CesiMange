'use client';
import React from 'react';

export interface Article {
    id: number; // Ajout de l'identifiant
    image: string;
    text: string;
}

interface ArticleCardProps {
    article: Article;
    onAdd?: () => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onAdd }) => {
    return (
        <div className="w-44 p-5 bg-white rounded-[20px] inline-flex flex-col justify-start items-start gap-[5px] overflow-hidden">
            <img className="w-32 h-32 rounded-[20px]" src={article.image} alt={article.text} />
            <div className="w-32 flex flex-col justify-start items-start gap-2.5">
                <div className="flex flex-col justify-center items-center gap-2.5">
                    <div className="text-black text-base font-normal font-['Inter'] leading-snug">{article.text}</div>
                </div>
                <div className="self-stretch inline-flex justify-center items-center">
                    <button onClick={onAdd} data-state="Default" className="h-5 px-4 py-4 bg-lime-500 rounded-[20px] flex justify-center items-center gap-2.5">
                        <div className="text-center text-white text-base font-bold font-['Inter']">+</div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ArticleCard;
