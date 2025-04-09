// context/SearchContext.tsx
'use client';

import { createContext, useContext, useState } from 'react';

type SearchContextType = {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
};

const SearchContext = createContext<SearchContextType>({
    searchTerm: '',
    setSearchTerm: () => { },
});

export const SearchProvider = ({ children }: { children: React.ReactNode }) =>
{
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => useContext(SearchContext);