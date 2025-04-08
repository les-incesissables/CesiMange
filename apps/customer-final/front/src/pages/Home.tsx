import React, { useEffect } from 'react';
import HomeLayout from '../layout/HomeLayout';
import CategorieList from '../components/List/CategorieList';
import RestaurantList from '../components/List/RestaurantList';
import { useInfiniteQuery } from '@tanstack/react-query';
import { LocalMiddleware } from '../../../local-middleware/src/middleware/LocalMiddleware';
import { IRestaurant } from '../models/interfaces/IRestaurant/IRestaurant';
import { useSearch } from '../components/Utils/SearchContext';

const localMiddleware = new LocalMiddleware();
const LIMIT = 10;

const Home: React.FC = () =>
{
    const { searchTerm } = useSearch();
    const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage, refetch } = useInfiniteQuery({
        queryKey: ['restaurants', searchTerm],
        queryFn: ({ pageParam = 1 }) =>
        {
            const lRestaurantCritere = {
                nameLike: searchTerm
            };
            return localMiddleware.callLocalApi(() => localMiddleware.RestoRepo.getItems(lRestaurantCritere, pageParam, LIMIT));
        },
        getNextPageParam: (lastPage) => (lastPage.data[1].hasNext ? lastPage.data[1].page + 1 : null),
        initialPageParam: 1
    });

    useEffect(() =>
    {
        if (searchTerm)
        {
            refetch();
        }
    }, [searchTerm, refetch]);

    if (isLoading) return <div>Chargement...</div>;
    if (isError) return <div>Erreur</div>;

    const allRestaurants = data?.pages.flatMap((page) => page.data[0] as IRestaurant[]) ?? [];
    const currentPage = data?.pages[data.pages.length - 1].data[1].page || 1;

    return (
        <HomeLayout>
            <CategorieList />
            <RestaurantList restaurants={allRestaurants} />

            <div className="flex items-center justify-center gap-4 my-8">
                <span className="px-6 py-2 bg-stone-300 border border-black rounded-[20px] text-black font-['Inter'] font-bold shadow-[0px_4px_4px_rgba(0,0,0,0.25)] outline outline-1 outline-black outline-offset-[-1px]">
                    Page {currentPage}
                </span>

                <button
                    onClick={() => fetchNextPage()}
                    disabled={!hasNextPage || isFetchingNextPage}
                    className={`px-6 py-2 rounded-[20px] font-['Inter'] font-bold transition-all shadow-[0px_4px_4px_rgba(0,0,0,0.25)] 
                        ${!hasNextPage
                            ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                            : 'bg-yellow-400 text-black hover:bg-yellow-500 hover:shadow-md outline outline-1 outline-black outline-offset-[-1px]'
                        }`}
                >
                    {isFetchingNextPage ? 'Chargement...' : hasNextPage ? 'Charger plus →' : 'Plus de restaurants'}
                </button>
            </div>
        </HomeLayout>
    );
};

export default Home;
