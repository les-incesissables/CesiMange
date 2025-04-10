'use client';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { BellIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import CartPopup from './CartPopUp';
import { AuthContext, AuthContextType } from '../context/AuthContext';
import { UserIcon } from '@heroicons/react/24/solid';

// Si besoin, importer d'autres composants (ex. LoginButton, ClickableText, SearchBar, AccountSidebar)
import LoginButton from './Buttons/LoginButton';
import ClickableText from './Buttons/ClickableText';
import AccountSidebar from './Utils/SideBarAccount';
import SearchBar from './Utils/SearchBar';

interface HeaderProps {
    variant: 'general' | 'client';
    onLoginClick?: () => void;
    onBellClick?: () => void;
}

const NavBar: React.FC<HeaderProps> = ({ variant, onLoginClick, onBellClick }) => {
    // Récupère le panier à partir du contexte de panier
    const { cart } = useCart();
    // Récupère l'état d'authentification
    const { authState } = useContext<AuthContextType>(AuthContext);

    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [showCartPopup, setShowCartPopup] = useState<boolean>(false);
    const popupRef = useRef<HTMLDivElement>(null);

    // Calculer le nombre total d'articles dans le cart
    const totalItems: number = cart.reduce((acc, item) => acc + item.quantity, 0);

    // Gestion du clic sur l'icône du panier (affichage du popup)
    const onCartClick = () => {
        setShowCartPopup(true);
        console.log(`Nombre total d'articles dans le cart: ${totalItems}`);
    };

    // Ferme le popup lorsqu'on clique en dehors
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
                setShowPopup(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (variant === 'general') {
        return (
            <div className="sticky top-0 z-50 px-4 sm:px-24 py-2.5 bg-yellow-400 border-b border-black">
                <div className="flex items-center justify-between w-full">
                    {/* Logo à gauche */}
                    <Link to="/">
                        <div className="relative overflow-hidden flex-shrink-0 w-24 sm:w-32">
                            <img src="/images/CesiMange_transparant.png" alt="Logo" className="w-full h-auto object-contain" />
                        </div>
                    </Link>
                    {/* Menu à droite */}
                    {!authState.isLogged ? (
                        <div className="flex items-center gap-20">
                            <ClickableText text="Devenir partenaire" />
                            <LoginButton text="Se connecter" onClick={onLoginClick} />
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            {/* Icône notifications */}
                            <div className="flex items-end gap-2">
                                <button className="w-10 h-10 cursor-pointer" onClick={onBellClick}>
                                    <BellIcon className="w-full h-full" />
                                </button>
                                <div className="min-w-[1rem] px-1 bg-Schemes-Error rounded-full flex justify-center items-center overflow-hidden">
                                    <div className="text-Schemes-On-Error text-xs font-medium font-['Roboto'] leading-none tracking-wide text-center">3</div>
                                </div>
                            </div>

                            {/* Icône panier */}
                            <div className="flex items-end gap-2">
                                <button className="w-10 h-10 cursor-pointer" onClick={onCartClick}>
                                    <ShoppingCartIcon className="w-full h-full" />
                                </button>
                                <div className="min-w-[1rem] px-1 bg-Schemes-Error rounded-full flex justify-center items-center overflow-hidden">
                                    <div className="text-Schemes-On-Error text-xs font-medium font-['Roboto'] leading-none tracking-wide text-center">
                                        {totalItems}
                                    </div>
                                </div>
                                {showCartPopup && <CartPopup onClose={() => setShowCartPopup(false)} />}
                            </div>

                            {/* Icône compte */}
                            <div ref={popupRef}>
                                <button className="flex" onClick={() => setShowPopup(!showPopup)}>
                                    <UserIcon className="w-10 h-10 bg-zinc-300 rounded-full border border-black cursor-pointer" />
                                </button>
                                {showPopup && <AccountSidebar onClose={() => setShowPopup(false)} />}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    } else if (variant === 'client') {
        return (
            <div className="sticky top-0 z-50 px-4 sm:px-24 py-2.5 bg-yellow-400 border-b border-black">
                <div className="max-w-[1440px] mx-auto flex flex-wrap lg:flex-nowrap justify-between items-center">
                    {/* Logo */}
                    <Link to="/">
                        <div className="relative overflow-hidden flex-shrink-0 w-24 sm:w-32">
                            <img src="/images/CesiMange_transparant.png" alt="Logo" className="w-full h-auto object-contain" />
                        </div>
                    </Link>

                    {/* SearchBar unique - positionné différemment selon la taille d'écran */}
                    <div className="order-3 lg:order-2 w-full lg:w-auto mt-2 lg:mt-0">
                        <SearchBar placeHolder="Chercher un restaurant" textButton="Rechercher" onClick={() => {}} />
                    </div>

                    {authState.isLogged ? (
                        <>
                            {/* Section droite : notifications, panier, compte */}
                            <div className="order-2 lg:order-3 flex items-center gap-4">
                                {/* Notifications */}
                                <div className="flex items-end gap-2">
                                    <button className="w-10 h-10 cursor-pointer" onClick={onBellClick}>
                                        <BellIcon className="w-full h-full" />
                                    </button>
                                    <div className="min-w-[1rem] px-1 bg-Schemes-Error rounded-full flex justify-center items-center overflow-hidden">
                                        <div className="text-Schemes-On-Error text-xs font-medium font-['Roboto'] leading-none tracking-wide text-center">
                                            3
                                        </div>
                                    </div>
                                </div>
                                {/* Panier */}
                                <div className="flex items-end gap-2">
                                    <button className="w-10 h-10 cursor-pointer" onClick={onCartClick}>
                                        <ShoppingCartIcon className="w-full h-full" />
                                    </button>
                                    <div className="min-w-[1rem] px-1 bg-Schemes-Error rounded-full flex justify-center items-center overflow-hidden">
                                        <div className="text-Schemes-On-Error text-xs font-medium font-['Roboto'] leading-none tracking-wide text-center">
                                            {totalItems}
                                        </div>
                                    </div>
                                    {showCartPopup && <CartPopup onClose={() => setShowCartPopup(false)} />}
                                </div>
                                {/* Compte */}
                                <div ref={popupRef}>
                                    <button className="flex" onClick={() => setShowPopup(!showPopup)}>
                                        <UserIcon className="w-10 h-10 bg-zinc-300 rounded-full border border-black cursor-pointer" />
                                    </button>
                                    {showPopup && <AccountSidebar onClose={() => setShowPopup(false)} />}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex order-2 lg:order-4 items-center gap-20">
                            <ClickableText text="Devenir partenaire" />
                            <LoginButton text="Se connecter" onClick={onLoginClick} />
                        </div>
                    )}
                </div>
            </div>
        );
    }
    return null;
};

export default NavBar;
