'use client';
import React from 'react';
import DashBoardLayout from '../../layout/DashBoardLayout';
import RestaurantList from '../../components/List/RestaurantList';

const DashBoardFavorites: React.FC = () => {
    return (
        <DashBoardLayout>
            <div className="self-stretch h-[846px] px-12 pt-12 bg--Beige-clair inline-flex flex-col justify-start items-start gap-10 overflow-hidden">
                {/* <RestaurantList /> */}
            </div>
        </DashBoardLayout>
    );
};

export default DashBoardFavorites;
