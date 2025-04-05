'use client';
import React, { useState } from 'react';
import Button from '../Button';

interface onClick {
    onClick?: () => void;
    textButton: string;
    textInput: string;
}

const SearchBar: React.FC<onClick> = ({ onClick, textButton, textInput }) => {
    const [searchText, setSearchText] = useState('');

    return (
        <div className="mx-auto w-full max-w-[700px] px-4">
            <div className="flex flex-col items-stretch gap-2 rounded-[20px] bg-white p-2.5 outline outline-1 outline-offset-[-1px] outline-black/50 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex w-full items-center gap-3">
                    <img src="/images/loupe.svg" className="h-5 w-5 shrink-0" />
                    <input
                        type="text"
                        placeholder={textInput}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-full bg-transparent font-['Inter'] text-xl text-black/50 outline-none"
                    />
                </div>
                <div className="w-full sm:w-auto">
                    <Button label={textButton} onClick={onClick} />
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
