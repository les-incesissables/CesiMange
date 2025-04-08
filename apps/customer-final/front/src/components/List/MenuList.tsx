'use client';
import React from 'react';
import MenuCard from '../Card/MenuCard';
import { IMenu } from '../../models/interfaces/IRestaurant/IMenu';

interface ArticleListProps {
    menus: IMenu[];
    onAddToCart?: () => void;
}

const MenuList: React.FC<ArticleListProps> = ({ menus }) => {
    return (
        <ul className="flex flex-wrap gap-4">
            {menus.map((menu) => (
                <li>
                    <MenuCard menu={menu} />
                </li>
            ))}
        </ul>
    );
};

export default MenuList;
