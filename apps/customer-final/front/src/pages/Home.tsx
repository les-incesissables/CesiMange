import HomeLayout from '../layout/HomeLayout';
import CategorieList from '../components/List/CategorieList';
import RestaurantList from '../components/List/RestaurantList';
import { useQuery } from '@tanstack/react-query';
import { LocalMiddleware } from '../../../local-middleware/src/middleware/LocalMiddleware';

const localMiddleware = new LocalMiddleware();

const Home: React.FC = () => {
    // Utilisation de useQuery pour récupérer la liste des utilisateurs via le middleware local
    const lData: any = useQuery({
        queryKey: ['restaurants'],
        queryFn: async () => await localMiddleware.callLocalApi(async () => await localMiddleware.RestoRepo.fetchAll()),
    });
    let l = async () => {
        await localMiddleware.callLocalApi(async () => await localMiddleware.RestoRepo.fetchAll());
    };
    const restaurantData = lData.data;

    return (
        <HomeLayout>
            <CategorieList />
            <RestaurantList restaurants={restaurantData} />
        </HomeLayout>
    );
};

export default Home;
