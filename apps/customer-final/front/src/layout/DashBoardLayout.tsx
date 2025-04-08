import React, { Fragment } from 'react';

// Importation de composants communs
import Footer from '../components/Footer';
import NavBar from '../components/NavBar';
import LeftSideBarUser from '../components/LesftSideBar/LeftSideBar-User';

interface DashBoardLayoutProps {
    children: React.ReactNode; // Accepte n'importe quel élément React valide comme enfant
}

// Définition du composant HomeLayout
const DashBoardLayout: React.FC<DashBoardLayoutProps> = ({ children }) => {
    return (
        <Fragment>
            <NavBar variant="client" />
            <div className="flex h-full bg-[#E4DBC7]">
                <LeftSideBarUser />
                <main className="flex-1 p-8 overflow-auto">{children}</main>
            </div>
            <Footer />
        </Fragment>
    );
};

export default DashBoardLayout;
