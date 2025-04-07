import React from 'react';
import RestaurantCard from '../Card/RestaurantCard';
import { IRestaurant } from '../../models/interfaces/IRestaurant/IRestaurant';

interface RestaurantListProps {
    restaurants: IRestaurant[];
}

const RestaurantList: React.FC<RestaurantListProps> = ({ restaurants }) => {
    return (
        <div className="w-full py-4 center">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-6 max-w-screen-xl mx-auto">
                {restaurants.map((restaurant) => (
                    <RestaurantCard name={restaurant.name} imageSrc={restaurant.logo} title={restaurant.name} subtitle={restaurant.description} />
                ))}
            </div>
        </div>
    );
};

export default RestaurantList;
