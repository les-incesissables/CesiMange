'use client';
import React from 'react';
import SimpleCard from '../Card/SimpleCard';

interface CardItem {
    imageUrl: string;
    text: string;
}

interface SimpleCardListProps {
    items: CardItem[];
}

const SimpleCardList: React.FC<SimpleCardListProps> = ({ items }) => {
    return (
        <ul className="flex flex-wrap gap-4">
            {items.map((item, index) => (
                <li key={index}>
                    <SimpleCard imageUrl={item.imageUrl} text={item.text} />
                </li>
            ))}
        </ul>
    );
};

export default SimpleCardList;
