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
        <div className="mx-auto inline-flex h-12 w-full max-w-[700px] items-center justify-between rounded-[20px] bg-white p-2.5 outline outline-1 outline-offset-[-1px] outline-black/50">
            <div className="flex flex-1 items-center justify-start gap-5">
                <div data-size="48" className="relative h-7 w-7 overflow-hidden">
                    <img src="/images/loupe.svg" />
                </div>
                <input
                    type="text"
                    placeholder={textInput}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="flex-1 bg-transparent font-['Inter'] text-xl font-normal text-black/50 outline-none"
                />
            </div>
            <Button text={textButton} onClick={onClick} />
        </div>
    );
};

export default SearchBar;
