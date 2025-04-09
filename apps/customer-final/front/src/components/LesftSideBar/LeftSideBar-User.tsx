'use client';
import React from 'react';
import ClickableText from '../Buttons/ClickableText';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router';

interface OptionItemProps {
    icon: string;
    label: string;
    path: string;
    selected?: boolean;
}

const OptionItem: React.FC<OptionItemProps> = ({ icon, label, path, selected = false }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(path);
    };

    return (
        <div className="flex items-center gap-3">
            {icon && <img src={icon} alt={`${label} icon`} className="w-7 h-7 object-contain" />}
            <ClickableText text={label} selected={selected} onClick={handleClick} />
        </div>
    );
};

const LeftSideBarUser: React.FC = () => {
    const { logout } = useAuth();

    return (
        <aside className="w-80 h-screen sticky top-0 px-8 py-8 border-r border-black flex flex-col gap-8 overflow-y-auto bg-[#E4DBC7]">
            {/* Titre du compte */}
            <header className="text-4xl font-bold text-black font-['Inter'] text-center">Nom Compte</header>

            <hr className="w-full border border-black/50" />

            {/* Liste des options */}
            <nav className="flex flex-col gap-4">
                <OptionItem icon="/images/users.svg" label="Mon Compte" path="/dashboard/account" />
                <OptionItem icon="/images/archive.svg" label="Mes Commandes" path="/dashboard/order" />
                <OptionItem icon="/images/heart.svg" label="Mes favoris" path="/dashboard/favorites" />
                <OptionItem icon="/images/users.svg" label="Parrainage" path="/dashboard/sponsorship" />
            </nav>

            <hr className="w-full border border-black/50" />

            {/* Option ajouter un restaurant */}
            <div className="flex justify-center">
                <ClickableText text="Ajoutez votre restaurant" />
            </div>

            {/* Bouton Déconnexion */}
            <div onClick={logout} className="flex justify-center">
                <ClickableText text="Déconnexion" />
            </div>
        </aside>
    );
};

export default LeftSideBarUser;
