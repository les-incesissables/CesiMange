'use client';
import React, { useState } from 'react';
import Button from '../Buttons/Button';

interface onClick {
    onClick?: () => void;
    textInput: string;
    textButton: string;
}

const SearchBar: React.FC<onClick> = ({ onClick, textInput, textButton }) => {
    const [searchText, setSearchText] = useState('');

    return (
        <div className="w-full max-w-[700px] mx-auto h-12 p-2.5 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-black/50 inline-flex justify-between items-center">
            <div className="flex flex-1 justify-start items-center gap-5">
                <div data-size="48" className="w-7 h-7 relative overflow-hidden">
                    <img src="/images/loupe.svg" />
                </div>
                <input
                    type="text"
                    placeholder={textInput}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="bg-transparent outline-none text-black/50 text-xl font-normal font-['Inter'] flex-1"
                />
            </div>
            <Button text={textButton} onClick={onClick} />
        </div>
    );
};

export default SearchBar;
