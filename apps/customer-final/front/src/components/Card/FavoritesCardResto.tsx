'use client';
import React from 'react';

interface FavoriteRestaurantCardProps {
    imageUrl?: string; // URL de l'image du restaurant
    name?: string; // Nom du restaurant
    iconUrl?: string; // Optionnel : URL d'une icône (ou icône par défaut)
}

const FavoriteRestaurantCard: React.FC<FavoriteRestaurantCardProps> = ({
    imageUrl,
    name,
    iconUrl = '', // Vous pouvez mettre un fallback si nécessaire
}) => {
    return (
        <div
            data-property-1="resto-favoris"
            data-type="desktop"
            className="w-72 h-36 p-2.5 bg-white rounded-[20px] outline-1 outline-offset-[-1px] outline-black inline-flex justify-start items-end gap-2.5 overflow-hidden"
        >
            <div className="flex-1 h-32 flex justify-between items-end">
                {/* Image du restaurant */}
                <img className="w-32 h-32 rounded-[20px] object-cover" src={imageUrl} alt={name} />
                {/* Bloc droit (icône + nom) */}
                <div className="inline-flex flex-col justify-between items-center">
                    <div className="inline-flex justify-end items-center gap-2.5">
                        <div className="w-7 h-7 relative overflow-hidden">
                            {iconUrl ? (
                                <img className="w-7 h-6 absolute top-[3.75px] left-[1.94px]" src={iconUrl} alt="Icon" />
                            ) : (
                                // Icône vide ou outline si vous n'avez pas d'icône
                                <div className="w-7 h-6 absolute top-[3.75px] left-[1.94px] outline-4 outline-offset-[-2px] outline-Icon-Default-Default" />
                            )}
                        </div>
                    </div>
                    <div className="w-28 text-black text-base font-normal font-['Inter'] leading-snug">{name}</div>
                </div>
            </div>
        </div>
    );
};

export default FavoriteRestaurantCard;
