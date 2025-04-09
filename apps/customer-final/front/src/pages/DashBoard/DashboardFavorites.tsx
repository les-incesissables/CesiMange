'use client';
import React from 'react';
import DashBoardLayout from '../../layout/DashBoardLayout';
import FavoriteRestaurantCardList from '../../components/List/FavoritesCardRestoList';

const DashBoardFavorites: React.FC = () => {
    return (
        <DashBoardLayout>
            {/* Conteneur principal */}
            <div className="w-full min-h-screen px-12 pt-12 bg-[#E4DBC7] flex flex-col gap-10 overflow-y-auto">
                {/* Titre de la page */}
                <div className="flex flex-col gap-5">
                    <h1 className="text-4xl font-bold text-black font-['Inter']">Mes favoris</h1>
                    <hr className="border-black" />
                </div>

                {/* Conteneur des favoris */}
                <div className="flex-1 pb-12">
                    <div className="w-full flex flex-wrap gap-6 justify-start items-start">
                        {/* Exemple de cartes statiques */}
                        {/* <FavoriteRestaurantCardList /> */}
                    </div>
                </div>
            </div>
        </DashBoardLayout>
    );
};

export default DashBoardFavorites;
