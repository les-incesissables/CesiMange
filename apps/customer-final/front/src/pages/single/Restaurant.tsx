// Restaurant.tsx
'use client';
import React from 'react';
import RestaurantLayout from '../../layout/single/RestaurantLayout';
import { useLocation } from 'react-router';
import { IRestaurant } from '../../models/interfaces/IRestaurant/IRestaurant';
import { StarIcon } from '@heroicons/react/24/outline';
import CategorySectionList from '../../components/List/CategorySectionList';
import { IArticles } from '../../models/interfaces/IRestaurant/IArticles';
import { IMenu } from '../../models/interfaces/IRestaurant/IMenu';

interface CategoryContent {
    articles?: IArticles[];
    menus?: IMenu[];
}

const Restaurant: React.FC = () => {
    const location = useLocation();
    const restaurant = location.state as IRestaurant;

    if (!restaurant) {
        return <div>Aucun restaurant trouvé.</div>;
    }

    const groupedContent: Record<string, CategoryContent> = {};

    // Regrouper les menus
    restaurant.menu.forEach((menuItem) => {
        const category = menuItem.categorie || 'Autres';
        if (!groupedContent[category]) {
            groupedContent[category] = {};
        }
        if (!groupedContent[category].menus) {
            groupedContent[category].menus = [];
        }
        groupedContent[category].menus!.push(menuItem);
    });

    // Regrouper les articles
    restaurant.articles.forEach((article) => {
        const category = article.category || 'Autres';
        if (!groupedContent[category]) {
            groupedContent[category] = {};
        }
        if (!groupedContent[category].articles) {
            groupedContent[category].articles = [];
        }
        groupedContent[category].articles!.push(article);
    });

    return (
        <RestaurantLayout>
            <div className="flex-1 bg-[#E4DBC7] p-8">
                {/* Section Bannière & Infos Restaurant */}
                <section className="mb-12">
                    <img className="w-full h-56 object-contain shadow-md border-b border-black" src="https://placehold.co/1128x232" alt="Restaurant Banner" />
                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 flex-shrink-0 relative overflow-hidden">
                                    <StarIcon className="w-full h-full text-yellow-500" />
                                </div>
                                <span className="text-black text-base font-semibold font-['Inter']">4.5 Etoiles</span>
                            </div>
                            <span className="text-black text-base font-normal font-['Inter']">{restaurant.location.address}</span>
                            <span className="text-black text-base font-normal font-['Inter']">Distance</span>
                            <span className="text-black text-base font-normal font-['Inter']">{restaurant.delivery_options.delivery_fee} €</span>
                        </div>
                    </div>
                </section>

                {/* Section Catégories / Articles & Menus */}
                <section>
                    <CategorySectionList categories={groupedContent} />
                </section>
            </div>
        </RestaurantLayout>
    );
};

export default Restaurant;
