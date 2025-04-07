// pages/index.tsx
import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import SearchBar from '../components/Utils/SearchBar';

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    const handleSearch = () => {
        // Redirige vers la page '/home'
        navigate({ to: '/home' });
    };

    return (
        <div className="w-full bg-[#E4DBC7] inline-flex flex-col justify-start items-center gap-5">
            <div className="p-2.5">
                <h1>Hello, ceci est la page racine!</h1>
            </div>
            <div className="p-2.5 flex flex-col justify-center items-center gap-2.5">
                <div className="bg-yellow-400 p-5 rounded-2xl shadow-lg transition-all duration-300">
                    <SearchBar onClick={handleSearch} textButton="Découvrir" textInput="Rechercher" />
                    <ul className="text-black text-2xl font-normal font-['Inter'] pl-5">
                        <li>1 rue du Verger</li>
                        <li>44 rue du dossier</li>
                        <li>1 avenue de la semaine</li>
                    </ul>
                </div>
            </div>
            <img className="max-w-full max-h-[692px] object-contain p-2.5" src="/images/CesiMange_transparant.png" alt="CesiMange" />
        </div>
    );
};

export default HomePage;
