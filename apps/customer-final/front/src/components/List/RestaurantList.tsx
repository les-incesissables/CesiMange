import React from 'react';
import RestaurantCard from '../Card/RestaurantCard';
import { IRestaurant } from '../../models/interfaces/IRestaurant/IRestaurant';

const RestaurantList: React.FC<IRestaurant[]> = (pRestaurants: IRestaurant[]) => {
    return (
        <div className="w-full py-4 center">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-6 max-w-screen-xl mx-auto">
                {pRestaurants.map((restaurant) => (
                    <RestaurantCard {...restaurant} />
                ))}
            </div>
        </div>
    );
};

export default RestaurantList;
