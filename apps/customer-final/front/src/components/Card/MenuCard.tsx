'use client';
import React from 'react';
import { IMenu } from '../../models/interfaces/IRestaurant/IMenu';

interface MenuCardProps {
    menu: IMenu;
    onAdd?: () => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ menu, onAdd }) => {
    return (
        <div className="w-44 p-5 bg-white rounded-[20px] inline-flex flex-col justify-center items-center gap-2 overflow-hidden shadow hover:shadow-lg transition duration-200">
            <img className="w-32 h-32 rounded-[20px] object-cover" />
            <div className="flex flex-col justify-center items-center gap-2.5">
                <div className="text-black text-base font-normal font-['Inter'] leading-snug underline">{menu.name}</div>
                <div className="text-black text-base font-normal font-['Inter'] "> €</div>
            </div>
            <div className="self-stretch inline-flex justify-center items-center">
                <button
                    onClick={onAdd}
                    data-state="Default"
                    className="h-5 px-4 py-4 bg-lime-500 hover:bg-lime-800 rounded-[20px] flex justify-center items-center gap-2.5"
                >
                    <div className="text-center text-white text-base font-bold font-['Inter']">+</div>
                </button>
            </div>
        </div>
    );
};

export default MenuCard;
