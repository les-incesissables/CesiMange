import HomeLayout from '../layout/HomeLayout';
import CategorieList from '../components/List/CategorieList';
import RestaurantList from '../components/List/RestaurantList';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { LocalMiddleware } from '../../../local-middleware/src/middleware/LocalMiddleware';

const localMiddleware = new LocalMiddleware();

const Home: React.FC = () =>
{
    try
    {
        const { data: restaurantData, isLoading, isError }: UseQueryResult<any, Error> = useQuery({
            queryKey: ['restaurants'],
            queryFn: async () =>
            {
                return await localMiddleware.callLocalApi(async () =>
                    await localMiddleware.RestoRepo.fetchAll()
                );
            }
        });

        if (isLoading) return <div>Chargement en cours...</div>;
        if (isError) return <div>Erreur de chargement des restaurants</div>;

        return (
            <HomeLayout>
                <CategorieList />
                <RestaurantList restaurants={restaurantData.data} />
            </HomeLayout>

        );

    } catch (e)
    {
        if (e) return <div>Erreur de chargement des restaurants</div>;
    }
};

export default Home;