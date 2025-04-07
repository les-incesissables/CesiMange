// pages/index.tsx
import React from 'react';
import RestaurantLayout from '../../layout/single/RestaurantLayout';
import LeftSideBarResto from '../../components/LesftSideBar/LeftSideBar-Resto';

const Restaurant: React.FC = () => {
    return (
        <RestaurantLayout>
            <LeftSideBarResto />
        </RestaurantLayout>
    );
};

export default Restaurant;
