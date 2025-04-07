// LeftSideBar-Resto.tsx
import React from 'react';
import CategorieRestoList from '../List/CategorieRestoList';

const categories = ['catégorie 1', 'catégorie 2', 'catégorie 3'];

const LeftSideBarResto: React.FC = () => {
    return (
        <div className="w-80 h-[846px] px-16 pb-24 border-r border-black inline-flex flex-col justify-start items-center gap-10 overflow-hidden">
            <img className="w-80 h-32 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" src="https://placehold.co/312x130" alt="Restaurant Banner" />
            <div className="justify-start text-black text-4xl font-bold font-['Inter']">Nom resto</div>
            <div className="justify-start text-black text-2xl font-normal font-['Inter']">Description</div>
            <div className="w-64 h-0 outline-1 outline-offset-[-0.50px] outline-black" />
            <CategorieRestoList categories={categories} />
            <div className="w-60 h-0 outline-1 outline-offset-[-0.50px] outline-black" />
        </div>
    );
};

export default LeftSideBarResto;
