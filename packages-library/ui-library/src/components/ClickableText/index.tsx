'use client';
import React from 'react';

interface ClickableTextProps {
    text?: string;
    onClick?: () => void;
}

const ClickableText: React.FC<ClickableTextProps> = ({ text, onClick }) => {
    return (
        <button onClick={onClick} className="group inline-flex items-center justify-center rounded-full px-4 py-1 transition-colors duration-200">
            <span className="font-['Inter'] text-base font-normal text-black transition-all duration-200 group-hover:text-black group-hover:underline">
                {text}
            </span>
        </button>
    );
};

export default ClickableText;
