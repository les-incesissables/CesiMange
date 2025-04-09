'use client';
import React from 'react';
import ClickableText from '../Buttons/ClickableText';
import Button from '../Buttons/Button';
import { useNavigate } from 'react-router';
import useAuth from '../../hooks/useAuth';

interface AccountSidebarProps {
    onClose: () => void;
}

const AccountSidebar: React.FC<AccountSidebarProps> = ({ onClose }) => {
    const { logout } = useAuth();

    const navigate = useNavigate();

    // Handlers de navigation
    const handleAccountClick = () => {
        navigate('/dashboard/account');
    };
    const handleOrderClick = () => {
        navigate('/dashboard/order');
    };
    const handleFavoritesClick = () => {
        navigate('/dashboard/favorites');
    };
    const handleParrainageClick = () => {
        navigate('/dashboard/sponsorship');
    };
    const handleDeconnexionClick = () => {
        // Action de déconnexion, ou navigation
        onClose();
        logout();
    };
    const handleAddRestaurantClick = () => {
        navigate('/add-restaurant');
    };
    const handleBecomeCourierClick = () => {
        navigate('/become-courier');
    };

    return (
        <div className="fixed top-0 right-0 z-50 w-80 h-screen bg-[#E4DBC7] border-l border-black shadow-lg flex flex-col px-6 py-6 overflow-y-auto">
            {/* Titre */}
            <h2 className="text-3xl text-black text-center mb-4">Mon Compte</h2>

            {/* Bouton "Gérer mon compte" */}
            <div className="flex justify-center mb-4">
                <Button text="Gérer mon compte" onClick={handleAccountClick} />
            </div>

            <hr className="border-black mb-6" />

            {/* SECTION 1 */}
            <div className="mb-6 flex flex-col gap-4 text-xl">
                {/* Mes commandes */}
                <div className="flex items-center gap-3 opacity-50">
                    <img src="/images/archive.svg" alt="Mes commandes icon" className="w-6 h-6 object-contain" />
                    <ClickableText text="Mes commandes" onClick={handleOrderClick} />
                </div>
                {/* Favoris */}
                <div className="flex items-center gap-3 opacity-50">
                    <img src="/images/heart.svg" alt="Favoris icon" className="w-6 h-6 object-contain" />
                    <ClickableText text="Favoris" onClick={handleFavoritesClick} />
                </div>
                {/* Parrainage */}
                <div className="flex items-center gap-3 opacity-50">
                    <img src="/images/users.svg" alt="Parrainage icon" className="w-6 h-6 object-contain" />
                    <ClickableText text="Parrainage" onClick={handleParrainageClick} />
                </div>
            </div>

            <hr className="my-4 border-black" />

            {/* SECTION 2 */}
            <div className="mb-6 flex justify-center">
                <div className="opacity-50">
                    <ClickableText text="Déconnexion" onClick={handleDeconnexionClick} />
                </div>
            </div>

            <hr className="my-4 border-black" />

            {/* SECTION 3 */}
            <div className="flex flex-col gap-4 text-xl">
                <div className="flex items-center justify-start opacity-50">
                    <ClickableText text="Ajoutez votre restaurant" onClick={handleAddRestaurantClick} />
                </div>
                <div className="flex items-center justify-start opacity-50">
                    <ClickableText text="Devenez coursier-partenaire" onClick={handleBecomeCourierClick} />
                </div>
            </div>
        </div>
    );
};

export default AccountSidebar;
