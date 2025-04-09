'use client';
import React from 'react';
import RestaurantCard from '../Card/RestaurantCard';
import { IRestaurant } from '../../models/interfaces/IRestaurant/IRestaurant';

interface RestaurantListProps {
    restaurants: IRestaurant[];
}

const RestaurantList: React.FC<RestaurantListProps> = ({ restaurants }) => {
    return (
        <div className="w-full py-4 sm:py-8 px-4 sm:px-6">
            <div className="max-w-screen-xl mx-auto grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-6">
                {restaurants.map((restaurant) => (
                    <RestaurantCard key={restaurant._id} {...restaurant} />
                ))}
            </div>
        </div>
    );
};

export default RestaurantList;
