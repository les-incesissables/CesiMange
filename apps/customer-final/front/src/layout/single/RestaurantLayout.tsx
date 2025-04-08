import React, { Fragment } from 'react';

// Importation de composants communs
import Footer from '../../components/Footer';
import NavBar from '../../components/NavBar';
import LeftSideBarResto from '../../components/LesftSideBar/LeftSideBar-Resto';
import { useLocation } from 'react-router';
import { IRestaurant } from '../../models/interfaces/IRestaurant/IRestaurant';

interface RestaurantLayoutProps {
    children: React.ReactNode; // Accepte n'importe quel élément React valide comme enfant
}

const RestaurantLayout: React.FC<RestaurantLayoutProps> = ({ children }) => {
    const location = useLocation();
    const restaurant = location.state as IRestaurant;

    if (!restaurant) {
        return <div>Aucun restaurant trouvé.</div>;
    }

    return (
        <Fragment>
            <NavBar variant="client" />
            <div className="flex h-full bg-[#E4DBC7]">
                <LeftSideBarResto restaurant={restaurant} />
                <main className="flex-1 p-8 overflow-auto">{children}</main>
            </div>
            <Footer />
        </Fragment>
    );
};

export default RestaurantLayout;
