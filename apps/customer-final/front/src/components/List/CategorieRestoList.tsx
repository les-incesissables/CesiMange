// CategorieList.tsx
import React from 'react';
import ClickableText from '../Buttons/ClickableText';

interface CategorieListProps {
    categories: string[];
}

const CategorieRestoList: React.FC<CategorieListProps> = ({ categories }) => {
    return (
        <div className="flex flex-col gap-2">
            {categories.map((categorie, index) => (
                <div key={index} data-state="Default" data-type="regular" className="self-stretch h-7 p-4 inline-flex justify-start items-center gap-2.5">
                    <ClickableText text={categorie} />
                </div>
            ))}
        </div>
    );
};

export default CategorieRestoList;
