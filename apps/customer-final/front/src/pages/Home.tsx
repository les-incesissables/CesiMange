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
            <RestaurantList restaurants={restaurantData.data[0] as IRestaurant[]} />

            <div className="flex items-center justify-center gap-4 my-8">
                <button
                    onClick={handlePrevPage}
                    disabled={page === 1}
                    className={`px-6 py-2 rounded-[20px] font-['Inter'] font-bold transition-all shadow-[0px_4px_4px_rgba(0,0,0,0.25)] ${page === 1
                            ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                            : 'bg-stone-300 text-black hover:bg-stone-400 hover:shadow-md outline outline-1 outline-black outline-offset-[-1px]'
                        }`}
                >
                    ← Précédent
                </button>

                <span className="px-6 py-2 bg-stone-300 border border-black rounded-[20px] text-black font-['Inter'] font-bold shadow-[0px_4px_4px_rgba(0,0,0,0.25)] outline outline-1 outline-black outline-offset-[-1px]">
                    Page {page}
                </span>

                <button
                    onClick={handleNextPage}
                    disabled={!restaurantData.data[1].hasNext}
                    className={`px-6 py-2 rounded-[20px] font-['Inter'] font-bold transition-all shadow-[0px_4px_4px_rgba(0,0,0,0.25)] ${!restaurantData.data[1].hasNext
                            ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                            : 'bg-yellow-400 text-black hover:bg-yellow-500 hover:shadow-md outline outline-1 outline-black outline-offset-[-1px]'
                        }`}
                >
                    Suivant →
                </button>
            </div>
        </HomeLayout>
    );
};

export default Home;