'use client';
import React from 'react';
import FavoriteRestaurantCard from '../Card/FavoritesCardResto';
import { IRestaurant } from '../../models/interfaces/IRestaurant/IRestaurant';

interface FavoriteRestaurantCardListProps {
    restaurants: IRestaurant[];
}

const FavoriteRestaurantCardList: React.FC<FavoriteRestaurantCardListProps> = ({ restaurants }) => {
    return (
        <ul className="flex flex-wrap gap-4">
            {restaurants.map((resto, index) => (
                <li key={index}>
                    <FavoriteRestaurantCard />
                </li>
            ))}
        </ul>
    );
};

export default FavoriteRestaurantCardList;
