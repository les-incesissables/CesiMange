'use client';
import React from 'react';
import { IMenu } from '../../models/interfaces/IRestaurant/IMenu';

interface MenuCardProps {
    menu: IMenu;
    onAdd?: () => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ menu, onAdd }) => {
    return (
        <div className="w-44 p-4 bg-white rounded-2xl flex flex-col items-center gap-4 shadow-md hover:shadow-xl transition-shadow duration-200">
            <img className="w-32 h-32 rounded-2xl object-cover" alt={menu.name} />
            <div className="flex flex-col items-center gap-2">
                <span className="text-black text-base font-medium font-['Inter']">{menu.name}</span>
                <div className="w-full flex items-center justify-between">
                    <span className="text-gray-700 text-base font-normal font-['Inter']">{/* Vous pouvez afficher ici un prix si nécessaire */}€</span>
                    <button
                        onClick={onAdd}
                        className="h-8 w-8 bg-lime-500 hover:bg-lime-600 rounded-full flex justify-center items-center transition-colors duration-200"
                    >
                        <span className="text-white text-base font-bold font-['Inter']">+</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MenuCard;
