import HomeLayout from '../layout/HomeLayout';
import CategorieList from '../components/List/CategorieList';
import RestaurantList from '../components/List/RestaurantList';

const Home: React.FC = () => {
    const restaurantData = [
        {
            imageSrc: 'https://placehold.co/180x120',
            title: 'Le Gourmet',
            subtitle: 'Français',
        },
        {
            imageSrc: 'https://placehold.co/180x120',
            title: 'Sushi Zen',
            subtitle: 'Japonais',
        },
        {
            imageSrc: 'https://placehold.co/180x120',
            title: 'Pizza Mia',
            subtitle: 'Italien',
        },
        {
            imageSrc: 'https://placehold.co/180x120',
            title: 'Spicy India',
            subtitle: 'Indien',
        },
        {
            imageSrc: 'https://placehold.co/180x120',
            title: 'Le Gourmet',
            subtitle: 'Français',
        },
        {
            imageSrc: 'https://placehold.co/180x120',
            title: 'Sushi Zen',
            subtitle: 'Japonais',
        },
        {
            imageSrc: 'https://placehold.co/180x120',
            title: 'Pizza Mia',
            subtitle: 'Italien',
        },
        {
            imageSrc: 'https://placehold.co/180x120',
            title: 'Spicy India',
            subtitle: 'Indien',
        },
        {
            imageSrc: 'https://placehold.co/180x120',
            title: 'Le Gourmet',
            subtitle: 'Français',
        },
        {
            imageSrc: 'https://placehold.co/180x120',
            title: 'Sushi Zen',
            subtitle: 'Japonais',
        },
        {
            imageSrc: 'https://placehold.co/180x120',
            title: 'Pizza Mia',
            subtitle: 'Italien',
        },
        {
            imageSrc: 'https://placehold.co/180x120',
            title: 'Spicy India',
            subtitle: 'Indien',
        },
        {
            imageSrc: 'https://placehold.co/180x120',
            title: 'Le Gourmet',
            subtitle: 'Français',
        },
        {
            imageSrc: 'https://placehold.co/180x120',
            title: 'Sushi Zen',
            subtitle: 'Japonais',
        },
        {
            imageSrc: 'https://placehold.co/180x120',
            title: 'Pizza Mia',
            subtitle: 'Italien',
        },
        {
            imageSrc: 'https://placehold.co/180x120',
            title: 'Spicy India',
            subtitle: 'Indien',
        },
        {
            imageSrc: 'https://placehold.co/180x120',
            title: 'Le Gourmet',
            subtitle: 'Français',
        },
        {
            imageSrc: 'https://placehold.co/180x120',
            title: 'Sushi Zen',
            subtitle: 'Japonais',
        },
        {
            imageSrc: 'https://placehold.co/180x120',
            title: 'Pizza Mia',
            subtitle: 'Italien',
        },
        {
            imageSrc: 'https://placehold.co/180x120',
            title: 'Spicy India',
            subtitle: 'Indien',
        },
    ];

    return (
        <HomeLayout>
            <CategorieList />
            <RestaurantList restaurants={restaurantData} />
        </HomeLayout>
    );
};

export default Home;
