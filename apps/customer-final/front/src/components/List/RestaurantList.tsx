import React from 'react';
import RestaurantCard from '../Card/RestaurantCard';

interface RestaurantListProps {
    restaurants: any[];
}

const RestaurantList: React.FC<RestaurantListProps> = ({ restaurants }) => {
    return (
        <div className="w-full py-4 center">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-6 max-w-screen-xl mx-auto">
                {restaurants.map((restaurant, id) => (
                    <RestaurantCard key={id} imageSrc={restaurant.logo} title={restaurant.name} subtitle={restaurant.description} />
                ))}
            </div>
        </div>
    );
};

export default RestaurantList;
