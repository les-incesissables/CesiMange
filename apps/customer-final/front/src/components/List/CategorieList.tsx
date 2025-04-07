import React from 'react';
import CategorieCard from '../Card/CategorieCard';

interface Categorie {
    imageSrc: string;
    label: string;
}

const categories: Categorie[] = [
    { imageSrc: 'https://placehold.co/69x73', label: 'Burger' },
    { imageSrc: 'https://placehold.co/69x73', label: 'Pizza' },
    { imageSrc: 'https://placehold.co/69x73', label: 'Tacos' },
    { imageSrc: 'https://placehold.co/69x73', label: 'Sushi' },
    { imageSrc: 'https://placehold.co/69x73', label: 'Salade' },
    { imageSrc: 'https://placehold.co/69x73', label: 'Wrap' },
    { imageSrc: 'https://placehold.co/69x73', label: 'Kebab' },
    { imageSrc: 'https://placehold.co/69x73', label: 'Pâtes' },
    { imageSrc: 'https://placehold.co/69x73', label: 'Donut' },
    { imageSrc: 'https://placehold.co/69x73', label: 'Crêpe' },
    { imageSrc: 'https://placehold.co/69x73', label: 'Waffle' },
];

const CategorieList: React.FC = () => {
    return (
        <div className="center sticky top-0 z-10 w-full h-36 px-11 py-3 bg-beige-clair border-b inline-flex justify-start items-center gap-7 overflow-x-auto overflow-y-hidden backdrop-blur-sm">
            {categories.map((categorie, idx) => (
                <CategorieCard key={idx} imageSrc={categorie.imageSrc} label={categorie.label} />
            ))}
        </div>
    );
};

export default CategorieList;
