import React from 'react';
import RestaurantCard from '../Card/RestaurantCard';

interface Restaurant {
    imageSrc: string;
    title: string;
    subtitle: string;
}

interface RestaurantListProps {
    restaurants: Restaurant[];
}

const RestaurantList: React.FC<RestaurantListProps> = ({ restaurants }) => {
    return (
        <div className="w-full py-4 center">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-6 max-w-screen-xl mx-auto">
                {restaurants.map((restaurant, idx) => (
                    <RestaurantCard key={idx} imageSrc={restaurant.imageSrc} title={restaurant.title} subtitle={restaurant.subtitle} />
                ))}
            </div>
        </div>
    );
};

export default RestaurantList;
