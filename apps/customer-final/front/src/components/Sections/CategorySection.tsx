'use client';
import React from 'react';
import ArticleList from '../List/ArticleList';
import { IArticles } from '../../models/interfaces/IRestaurant/IArticles';
import MenuList from '../List/MenuList';
import { IMenu } from '../../models/interfaces/IRestaurant/IMenu';

interface CategorySectionProps {
    category: string;
    articles?: IArticles[];
    menus?: IMenu[];
}

const CategorySection: React.FC<CategorySectionProps> = ({ category, articles, menus }) => {
    return (
        <section className="mb-8">
            <h3 className="mb-4 text-black text-2xl font-bold font-['Inter'] underline">{category}</h3>
            {articles ? <ArticleList articles={articles} /> : menus ? <MenuList menus={menus} /> : null}
        </section>
    );
};

export default CategorySection;
