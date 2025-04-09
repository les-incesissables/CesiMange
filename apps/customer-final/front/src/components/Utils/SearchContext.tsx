// context/SearchContext.tsx
'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';

type SearchContextType = {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    triggerSearch: (term: string) => void;
};

const SearchContext = createContext<SearchContextType>({
    searchTerm: '',
    setSearchTerm: () => { },
    triggerSearch: () => { },
});

export const SearchProvider = ({ children }: { children: React.ReactNode }) =>
{
    const [searchTerm, setSearchTerm] = useState('');
    const [searchCounter, setSearchCounter] = useState(0);

    // Force a re-render with the same term by incrementing a counter
    const triggerSearch = useCallback((term: string) =>
    {
        setSearchTerm(term);
        setSearchCounter(prev => prev + 1);
    }, []);

    const contextValue = {
        searchTerm,
        setSearchTerm,
        triggerSearch,
    };

    return (
        <SearchContext.Provider value={contextValue}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => useContext(SearchContext);