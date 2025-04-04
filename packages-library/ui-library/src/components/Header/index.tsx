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
    to: string;
}

const Header: React.FC<HeaderProps> = ({ variant, onLoginClick, onCartClick, onBellClick, to }) => {
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
                        <ClickableText text="Devenir partenaire" />
                        <Button text="Se connecter" onClick={onLoginClick} />
                    </div>
                </div>
            </header>
        );
    } else if (variant === 'client') {
        return (
            <header className="sticky top-0 z-50 border-b border-black bg-yellow-400 px-4 py-2.5 sm:px-24">
                <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between sm:flex-nowrap">
                    {/* Logo à gauche */}
                    <a href={to}>
                        <div className="relative w-24 flex-shrink-0 overflow-hidden sm:w-32">
                            <img src="/CesiMange_transparant.png" alt="Logo" className="h-auto w-full object-contain" />
                        </div>
                    </a>

                    {/* Barre de recherche */}
                    <div className="rounded-2xl shadow-lg transition-all duration-300">
                        <SearchBar textInput="Chercher un restaurant" textButton="Rechercher" />
                    </div>

                    {/* Section droite */}
                    <div className="mt-2 flex w-full items-center justify-between px-[5px] sm:mt-0 sm:w-52">
                        <div className="flex items-end gap-2">
                            <img src="/images/shopping-cart.svg" onClick={onCartClick} />
                            <div data-size="Large" className="bg-Schemes-Error flex min-w-[1rem] items-center justify-center overflow-hidden rounded-full px-1">
                                <div className="text-Schemes-On-Error text-center font-['Roboto'] text-xs leading-none font-medium tracking-wide">3</div>
                            </div>
                        </div>
                        <div className="flex items-end gap-2">
                            <img src="/images/archive.svg" onClick={onBellClick} />
                            <div data-size="Large" className="bg-Schemes-Error flex min-w-[1rem] items-center justify-center overflow-hidden rounded-full px-1">
                                <div className="text-Schemes-On-Error text-center font-['Roboto'] text-xs leading-none font-medium tracking-wide">3</div>
                            </div>
                        </div>
                        <div className="relative" ref={popupRef}>
                            <img
                                src="https://placehold.co/69x73"
                                alt="avatar"
                                className="h-12 w-12 cursor-pointer rounded-full border border-black bg-zinc-300"
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
