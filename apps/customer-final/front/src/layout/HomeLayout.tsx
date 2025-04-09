import React, { Fragment } from 'react';

// Importation de composants communs
import Footer from '../components/Footer';
import NavBar from '../components/NavBar';
import LeftSidebar from '../components/LesftSideBar/LeftSideBar';
import { SearchProvider } from '../components/Utils/SearchContext';

interface HomeLayoutProps {
    children: React.ReactNode; // Accepte n'importe quel élément React valide comme enfant
}

// Définition du composant HomeLayout
const HomeLayout: React.FC<HomeLayoutProps> = ({ children }) => {
    return (
        <SearchProvider>
          <Fragment>
            <NavBar variant="client" />
            <div className="flex h-full bg-[#E4DBC7]">
                <LeftSidebar />
                <main className="flex-1 p-8 overflow-auto">{children}</main>
            </div>
            <Footer />
            </Fragment>
        </SearchProvider>
    );
};

export default HomeLayout;
