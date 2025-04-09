'use client';
import React, { useState } from 'react';
import Button from '../Buttons/Button';
import { useSearch } from './SearchContext';

interface SearchBarProps {
    placeHolder: string;
    textButton: string;
    onClick?: (term: string) => void; // Callback optionnel avec le terme
}

const SearchBar: React.FC<SearchBarProps> = ({ placeHolder, textButton, onClick }) => {
    const [inputValue, setInputValue] = useState('');
    const { setSearchTerm } = useSearch();

    const handleSearch = () => {
        const trimmedValue = inputValue.trim();
        setSearchTerm(trimmedValue); // 1. Met à jour le contexte
        onClick?.(trimmedValue); // 2. Exécute le callback si fourni
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div
            className="
        w-full
        sm:max-w-md
        h-12
        p-2.5
        bg-white
        rounded-[20px]
        outline
        outline-1
        outline-offset-[-1px]
        outline-black/50
        inline-flex
        justify-between
        items-center
        mx-auto
      "
        >
            <div className="flex flex-1 items-center gap-3 sm:gap-5">
                <div data-size="48" className="w-7 h-7 relative overflow-hidden">
                    <img src="/images/loupe.svg" alt="Icône de recherche" />
                </div>
                <input
                    type="text"
                    placeholder={placeHolder}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="
            flex-1
            bg-transparent
            border-none
            outline-none
            text-black/50
            text-base
            sm:text-xl
            font-normal
            font-['Inter']
          "
                />
            </div>

            <Button text={textButton} onClick={handleSearch} />
        </div>
    );
};

export default SearchBar;
