'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import LoginButton from './Buttons/LoginButton';
import ClickableText from './Buttons/ClickableText';
import SearchBar from './Utils/SearchBar';
import AccountSidebar from './Utils/SideBarAccont';

interface HeaderProps {
    variant: 'general' | 'client';
    onLoginClick?: () => void;
    onBellClick?: () => void;
    onCartClick?: () => void;
}

const NavBar: React.FC<HeaderProps> = ({ variant, onLoginClick, onBellClick, onCartClick }) => {
    const [showPopup, setShowPopup] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);

    // Fermer en cliquant en dehors
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
            <header className="sticky top-0 z-50 px-4 sm:px-24 py-2.5 bg-yellow-400 border-b border-black">
                <div className="flex items-center justify-between w-full">
                    {/* Logo à gauche */}
                    <Link to="/home">
                        <div className="relative overflow-hidden flex-shrink-0 w-24 sm:w-32">
                            <img src="/images/CesiMange_transparant.png" alt="Logo" className="w-full h-auto object-contain" />
                        </div>
                    </Link>
                    {/* Menu à droite */}
                    <div className="flex items-center gap-20">
                        <ClickableText text="Devenir partenaire" />
                        <LoginButton text="Se connecter" onClick={onLoginClick} />
                    </div>
                </div>
            </header>
        );
    } else if (variant === 'client') {
        return (
            <header className="sticky top-0 z-50 px-4 sm:px-24 py-2.5 bg-yellow-400 border-b border-black">
                <div className="max-w-[1440px] mx-auto flex flex-wrap sm:flex-nowrap justify-between items-center">
                    {/* Logo à gauche */}
                    <Link to="/home">
                        <div className="relative overflow-hidden flex-shrink-0 w-24 sm:w-32">
                            <img src="/images/CesiMange_transparant.png" alt="Logo" className="w-full h-auto object-contain" />
                        </div>
                    </Link>

                    {/* Barre de recherche */}
                    <div className="rounded-2xl shadow-lg transition-all duration-300">
                        <SearchBar textInput="Chercher un restaurant" textButton="Rechercher" />
                    </div>

                    {/* Section droite */}
                    <div className="w-full sm:w-52 flex justify-between items-center px-[5px] mt-2 sm:mt-0">
                        <div className="flex items-end gap-2">
                            <div data-size="48" className="w-10 h-10 relative overflow-hidden">
                                <img src="/images/bell.svg" onClick={onBellClick} />
                            </div>
                            <div data-size="Large" className="min-w-[1rem] px-1 bg-Schemes-Error rounded-full flex justify-center items-center overflow-hidden">
                                <div className="text-Schemes-On-Error text-xs font-medium font-['Roboto'] leading-none tracking-wide text-center">3</div>
                            </div>
                        </div>
                        <div className="flex items-end gap-2">
                            <div data-size="48" className="w-10 h-10 relative overflow-hidden">
                                <img src="/images/shopping-cart.svg" onClick={onCartClick} />
                            </div>
                            <div data-size="Large" className="min-w-[1rem] px-1 bg-Schemes-Error rounded-full flex justify-center items-center overflow-hidden">
                                <div className="text-Schemes-On-Error text-xs font-medium font-['Roboto'] leading-none tracking-wide text-center">3</div>
                            </div>
                        </div>
                        <div className="relative" ref={popupRef}>
                            <img
                                src="https://placehold.co/69x73"
                                alt="avatar"
                                className="w-12 h-12 bg-zinc-300 rounded-full border border-black cursor-pointer"
                                onClick={() => setShowPopup(!showPopup)}
                            />
                            {showPopup && <AccountSidebar onClose={() => setShowPopup(false)} />}
                        </div>
                    </div>
                </div>
            </header>
        );
    }
    return null;
};

export default NavBar;
