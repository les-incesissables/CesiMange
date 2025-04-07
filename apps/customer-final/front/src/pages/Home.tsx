import React, { useState } from 'react';
import HomeLayout from '../layout/HomeLayout';
import CategorieList from '../components/List/CategorieList';
import RestaurantList from '../components/List/RestaurantList';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { LocalMiddleware } from '../../../local-middleware/src/middleware/LocalMiddleware';
import { IRestaurant } from '../models/interfaces/IRestaurant/IRestaurant';

const localMiddleware = new LocalMiddleware();

const Home: React.FC = () =>
{
    const [page, setPage] = useState<number>(1);
    const limit = 10;

    const {
        data: restaurantData,
        isLoading,
        isError,
    }: UseQueryResult<any, Error> = useQuery({
        queryKey: ['restaurants', page],
        queryFn: async () =>
        {
     
            return await localMiddleware.callLocalApi(async () =>
                await localMiddleware.RestoRepo.fetchAll(page, limit)
            );
        }
    });

    if (isLoading) return <div>Chargement en cours...</div>;
    if (isError) return <div>Erreur de chargement des restaurants</div>;

    const handleNextPage = () => setPage(prev => prev + 1);
    const handlePrevPage = () => setPage(prev => Math.max(prev - 1, 1));

    return (
        <HomeLayout>
            <CategorieList />
            <RestaurantList restaurants={restaurantData.data as IRestaurant[]} />

            <div className="pagination">
                <button onClick={handlePrevPage} disabled={page == 1}>
                    Page précédente
                </button>
                <span>Page {page}</span>
                <button onClick={handleNextPage}>
                    Page suivante
                </button>
            </div>
        </HomeLayout>
    );
};

export default Home;
