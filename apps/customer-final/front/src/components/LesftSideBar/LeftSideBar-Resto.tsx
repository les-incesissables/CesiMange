'use client';
import React from 'react';
import CategorieRestoList from '../List/CategorieRestoList';
import { IRestaurant } from '../../models/interfaces/IRestaurant/IRestaurant';

interface LeftSideBarRestoProps {
    restaurant: IRestaurant;
}

const LeftSideBarResto: React.FC<LeftSideBarRestoProps> = ({ restaurant }) => {
    // Extraction des catégories depuis le menu et les articles
    const menuCategories = restaurant.menu?.map((menuItem) => menuItem.categorie) || [];
    const articleCategories = restaurant.articles.map((article) => article.category);
    // Fusionner les catégories et éliminer les doublons
    const categories = Array.from(new Set([...menuCategories, ...articleCategories]));

    return (
        <aside className="w-80 h-screen sticky top-[80px] border-r border-black flex flex-col justify-start items-center gap-10 overflow-hidden">
            <img
                className="w-full h-32 object-contain shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
                src={"/images/restaurants/bannieres/" + restaurant.banniere}
                alt={`${restaurant.name} Banner`}
            />
            <h1 className="w-56 text-center text-black text-4xl font-bold font-['Inter'] underline">{restaurant.name}</h1>
            <p className="w-56 text-center text-black text-2xl font-normal font-['Inter']">{restaurant.description}</p>
            <hr className="w-64 border border-black/50" />
            <CategorieRestoList categories={categories} />
            <hr className="w-60 border border-black/50" />
        </aside>
    );
};

export default LeftSideBarResto;
