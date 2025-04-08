// pages/index.tsx
import React from 'react';
import RestaurantLayout from '../../layout/single/RestaurantLayout';
import LeftSideBarResto from '../../components/LesftSideBar/LeftSideBar-Resto';
import { useLocation } from 'react-router';
import { IRestaurant } from '../../models/interfaces/IRestaurant/IRestaurant';

const Restaurant: React.FC = () => {
    const location = useLocation();
    const restaurant = location.state;

    if (!restaurant) {
        return <div>Aucun restaurant trouvé.</div>;
    }

    return (
        <RestaurantLayout>
            <LeftSideBarResto restaurant={restaurant} />
        </RestaurantLayout>
    );
};

export default Restaurant;
