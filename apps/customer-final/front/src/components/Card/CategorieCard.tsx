import React from 'react';

interface ProductCardProps {
    imageSrc: string;
    label: string;
}

const CategorieCard: React.FC<ProductCardProps> = ({ imageSrc, label }) => {
    return (
        <div
            className="w-24 h-28 bg-yellow-400 rounded-xl shadow-md outline-1 outline-black outline-offset-[-1px] flex flex-col justify-start items-center gap-1.5 transition-transform hover:scale-105 hover:shadow-lg cursor-pointer"
            aria-label={label}
        >
            <div className="w-24 h-20 flex justify-center items-center overflow-hidden rounded-t-xl border-b border-black bg-white">
                <img className="w-16 h-20 object-contain" src={imageSrc} alt={label} />
            </div>
            <div className="text-black/60 text-sm font-medium font-inter text-center">{label}</div>
        </div>
    );
};

export default CategorieCard;
