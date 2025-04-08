'use client';
import React from 'react';

interface SimpleCardProps {
    imageUrl: string;
    text: string;
    className?: string; // Permet d'ajouter des classes supplémentaires si besoin
}

const SimpleCard: React.FC<SimpleCardProps> = ({ imageUrl, text, className = '' }) => {
    return (
        <div
            className={`
        w-44 p-5 bg-white rounded-[20px]
        outline-1 outline-offset-[-1px] outline-black
        inline-flex flex-col justify-start items-start gap-[5px]
        overflow-hidden ${className}
      `}
        >
            <img className="w-32 h-32 rounded-[20px]" src={imageUrl} alt={text} />
            <div className="w-32 flex flex-col justify-start items-start gap-2.5">
                <div className="flex flex-col justify-center items-center gap-2.5">
                    <div className="justify-start text-black text-base font-normal font-['Inter'] leading-snug">{text}</div>
                </div>
            </div>
        </div>
    );
};

export default SimpleCard;
