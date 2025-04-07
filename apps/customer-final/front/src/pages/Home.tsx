import HomeLayout from '../layout/HomeLayout';
import CategorieList from '../components/List/CategorieList';
import RestaurantList from '../components/List/RestaurantList';
import { useQuery } from '@tanstack/react-query';

export interface Restaurant {
    name: string;
    description: string;
    location: {
        address: string;
        city: string;
        postal_code: string;
        country: string;
        coordinates: [number, number];
    };
    cuisine_types: string[];
    phone: string;
    website: string;
    hours: {
        monday: string[];
        tuesday: string[];
        wednesday: string[];
        thursday: string[];
        friday: string[];
        saturday: string[];
        sunday: string[];
    };
    owner_id: number;
    status: string;
    rating: number;
    delivery_options: {
        delivery_fee: number;
        min_order_amount: number;
        estimated_delivery_time: number;
    };
    created_at: { $date: string };
    updated_at: { $date: string };
    updatedAt: { $date: string };
    banniere: string;
    logo: string;
}

export const restaurants: Restaurant[] = [
    {
        name: 'Le Bistrot Parisien',
        description: 'Cuisine française traditionnelle dans un cadre élégant',
        location: {
            address: '15 rue de la Paix',
            city: 'Paris',
            postal_code: '75002',
            country: 'France',
            coordinates: [2.3364, 48.8666],
        },
        cuisine_types: ['française', 'gastronomique', 'traditionnelle'],
        phone: '+33123456789',
        website: 'https://bistrotparisien.fr',
        hours: {
            monday: ['11:30-14:30', '19:00-22:30'],
            tuesday: ['11:30-14:30', '19:00-22:30'],
            wednesday: ['11:30-14:30', '19:00-22:30'],
            thursday: ['11:30-14:30', '19:00-22:30'],
            friday: ['11:30-14:30', '19:00-23:00'],
            saturday: ['11:30-15:00', '19:00-23:00'],
            sunday: ['12:00-15:00'],
        },
        owner_id: 12,
        status: 'closed',
        rating: 4.7,
        delivery_options: {
            delivery_fee: 3.99,
            min_order_amount: 15,
            estimated_delivery_time: 30,
        },
        created_at: { $date: '2025-04-01T15:06:49.999Z' },
        updated_at: { $date: '2025-04-03T16:11:06.582Z' },
        updatedAt: { $date: '2025-04-03T16:11:06.583Z' },
        banniere: 'test.svg',
        logo: 'test.svg',
    },
];

const Home: React.FC = () => {
    // Utilisation de useQuery si besoin
    // const lData: any = useQuery({
    //     queryKey: ['restaurants'],
    //     queryFn: () =>
    //         localMiddleware.callLocalApi(async () =>
    //             await localMiddleware.RestoRepo.fetchAll()
    //         ),
    // });
    // const restaurantData = lData.data;

    // Ici, nous utilisons le tableau "restaurants" que nous avons défini ci-dessus
    const restaurantData = restaurants;

    return (
        <HomeLayout>
            <CategorieList />
            <RestaurantList restaurants={restaurantData} />
        </HomeLayout>
    );
};

export default Home;
