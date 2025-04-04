'use client';
import React, { useEffect, useRef, useState } from 'react';
import Button from '../Button';
import ClickableText from '../ClickableText';
import SearchBar from '../SearchBar';

interface HeaderProps {
    variant: 'general' | 'client';
    onLoginClick?: () => void;
    onCartClick?: () => void;
    onBellClick?: () => void;
    OnClickableTextClick?: () => void;
    to: string;
}

const Header: React.FC<HeaderProps> = ({ variant, onLoginClick, onCartClick, onBellClick, OnClickableTextClick, to }) => {
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
            <header className="sticky top-0 z-50 border-b border-black bg-yellow-400 px-4 py-2.5 sm:px-24">
                <div className="flex w-full items-center justify-between">
                    {/* Logo à gauche */}
                    <a href={to}>
                        <div className="relative w-24 flex-shrink-0 overflow-hidden sm:w-32">
                            <img src="/images/CesiMange_transparant.png" alt="Logo" className="h-auto w-full object-contain" />
                        </div>
                    </a>
                    {/* Menu à droite */}
                    <div className="flex items-center gap-20">
                        <ClickableText text="Devenir partenaire" onClick={OnClickableTextClick} />
                        <Button text="Se connecter" onClick={onLoginClick} />
                    </div>
                </div>
            </header>
        );
    } else if (variant === 'client') {
        return (
            <header className="sticky top-0 z-20 border-b border-black bg-yellow-400 px-4 py-2.5 sm:px-2">
                <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between sm:flex-nowrap">
                    {/* Logo à gauche */}
                    <a href={to}>
                        <div className="relative w-24 flex-shrink-0 overflow-hidden sm:w-32">
                            <img src="/images/CesiMange_transparant.png" alt="Logo" className="h-auto w-full object-contain" />
                        </div>
                    </a>

                    {/* Barre de recherche */}
                    <div className="rounded-2xl shadow-lg transition-all duration-300">
                        <SearchBar textInput="Chercher un restaurant" textButton="Rechercher" />
                    </div>

                    {/* Section droite */}
                    <div className="mt-4 flex w-full items-center justify-center gap-4 sm:mt-0 sm:w-auto sm:justify-end">
                        {/* Cart */}
                        <div className="relative flex items-center gap-1">
                            <img src="/images/shopping-cart.svg" onClick={onCartClick} className="h-6 w-6 cursor-pointer" />
                            <div className="absolute -top-1 -right-2 rounded-full bg-red-500 px-1 text-xs text-white">5</div>
                        </div>

                        {/* Bell */}
                        <div className="relative flex items-center gap-1">
                            <img src="/images/bell.svg" onClick={onBellClick} className="h-6 w-6 cursor-pointer" />
                            <div className="absolute -top-1 -right-2 rounded-full bg-red-500 px-1 text-xs text-white">3</div>
                        </div>

                        {/* Avatar */}
                        <div className="relative">
                            <img
                                src="https://placehold.co/69x73"
                                alt="avatar"
                                className="h-10 w-10 cursor-pointer rounded-full border border-black"
                                onClick={onLoginClick}
                            />
                        </div>
                    </div>
                </div>
            </header>
        );
    }
    return null;
};

export default Header;
