'use client';
import React from 'react';

interface OrderItem {
    imageUrl: string;
    text: string;
}

interface OrderSectionProps {
    restaurantName?: string;
    restaurantAvatar?: string;
    date?: string;
    price?: string;
    items?: OrderItem[];
}

const OrderSection: React.FC<OrderSectionProps> = ({ restaurantName, restaurantAvatar = 'https://placehold.co/60x60', date, price }) => {
    return (
        <div className="w-[901px] h-80 px-5 pt-2.5 pb-5 bg-[#E4DBC7] rounded-[20px] outline-1 outline-offset-[-1px] outline-black inline-flex flex-col gap-2.5 overflow-hidden">
            {/* Header */}
            <div className="w-full flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                    <img className="w-14 h-14 rounded-full border border-black object-cover" src={restaurantAvatar} alt={restaurantName} />
                    <div className="text-black text-4xl font-bold font-['Inter']">{restaurantName}</div>
                </div>
                <div className="text-black text-[10px] font-normal font-['Inter']">{date}</div>
                <div className="text-black text-2xl font-medium font-['Inter']">{price}</div>
            </div>

            {/* Liste des articles */}
            <div className="w-full flex flex-wrap justify-start items-start gap-2.5">
                {/* {items.map((item, idx) => (
                    <SimpleCard key={idx} imageUrl={item.imageUrl} text={item.text} />
                ))} */}
            </div>
        </div>
    );
};

export default OrderSection;
