'use client';
import React, { useState } from 'react';
import Button from '../Buttons/Button';
import { useSearch } from './SearchContext';

interface SearchBarProps
{
    placeHolder: string;
    textButton: string;
    onClick?: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeHolder, textButton, onClick }) =>
{
    const [inputValue, setInputValue] = useState('');
    const { triggerSearch } = useSearch();

    const handleSearch = () =>
    {
        const trimmedValue = inputValue.trim();
        triggerSearch(trimmedValue); // Use triggerSearch instead of setSearchTerm
        onClick?.(trimmedValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent) =>
    {
        if (e.key === 'Enter') handleSearch();
    };

    return (
        <div className="w-full max-w mx-auto h-12 p-2.5 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-black/50 inline-flex justify-between items-center">
            <div className="flex flex-1 justify-start items-center gap-5">
                <div data-size="48" className="w-7 h-7 relative overflow-hidden">
                    <img src="/images/loupe.svg" alt="Icône de recherche" />
                </div>
                <input
                    type="text"
                    placeholder={placeHolder}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="bg-transparent outline-none text-black/50 text-xl font-normal font-['Inter'] flex-1"
                />
            </div>
            <Button text={textButton} onClick={handleSearch} />
        </div>
    );
};

export default SearchBar;