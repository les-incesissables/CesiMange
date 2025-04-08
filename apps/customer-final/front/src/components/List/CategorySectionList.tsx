'use client';
import React from 'react';
import CategorySection from '../Sections/CategorySection';
import { IArticles } from '../../models/interfaces/IRestaurant/IArticles';
import { IMenu } from '../../models/interfaces/IRestaurant/IMenu';

interface CategoryContent {
    articles?: IArticles[];
    menus?: IMenu[];
}

interface CategorySectionListProps {
    categories: Record<string, CategoryContent>;
}

const CategorySectionList: React.FC<CategorySectionListProps> = ({ categories }) => {
    return (
        <div className="flex flex-col gap-8">
            {Object.entries(categories).map(([category, content]) => (
                <CategorySection key={category} category={category} articles={content.articles} menus={content.menus} />
            ))}
        </div>
    );
};

export default CategorySectionList;
