import React from 'react';

interface RestaurantCardProps {
    imageSrc: string;
    title: string;
    subtitle: string;
    icon?: React.ReactNode;
    bgColor?: string;
    onClick?: () => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ imageSrc, title, subtitle, icon, onClick }) => {
    return (
        <div
            className={`w-48 h-52 p-3 bg-yellow-400 rounded-2xl shadow-md hover:shadow-lg transition duration-200 cursor-pointer flex flex-col justify-between overflow-hidden`}
            onClick={onClick}
            role="button"
            aria-label={`Carte restaurant : ${title}`}
        >
            {/* Image fixe */}
            <div className="w-full h-28 overflow-hidden rounded-xl border border-black bg-white shrink-0">
                <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
            </div>

            {/* Texte & icône */}
            <div className="flex justify-between items-center mt-2 h-[52px]">
                <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-black text-sm font-semibold truncate">{title}</span>
                    <span className="text-gray-600 text-xs truncate">{subtitle}</span>
                </div>

                {icon && <div className="ml-2 w-6 h-6 flex justify-center items-center shrink-0">{icon}</div>}
            </div>
        </div>
    );
};

export default RestaurantCard;
