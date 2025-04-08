'use client';
import React from 'react';
import CategorieRestoList from '../List/CategorieRestoList';
import { IRestaurant } from '../../models/interfaces/IRestaurant/IRestaurant';

interface LeftSideBarRestoProps {
    restaurant: IRestaurant;
}

const categories = ['catégorie 1', 'catégorie 2', 'catégorie 3'];

const LeftSideBarResto: React.FC<LeftSideBarRestoProps> = ({ restaurant }) => {
    return (
        <aside className="w-80 h-[846px] px-16 pt-12 pb-24 border-r border-black flex flex-col justify-center items-center gap-10 overflow-hidden">
            <img
                className="w-full h-32 object-contain shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
                src="https://placehold.co/312x130"
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
