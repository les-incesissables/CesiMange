import React, { Fragment } from 'react';

// Importation de composants communs
import Footer from '../../components/Footer';
import NavBar from '../../components/NavBar';

interface RestaurantLayoutProps {
    children: React.ReactNode; // Accepte n'importe quel élément React valide comme enfant
}

const RestaurantLayout: React.FC<RestaurantLayoutProps> = ({ children }) => {
    return (
        <Fragment>
            <NavBar variant="client" />
            <div className="flex h-full bg-[#E4DBC7]">
                <main className="flex-1 p-8 overflow-auto">{children}</main>
            </div>
            <Footer />
        </Fragment>
    );
};

export default RestaurantLayout;
