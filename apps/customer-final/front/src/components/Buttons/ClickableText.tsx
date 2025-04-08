'use client';
import React from 'react';

interface ClickableTextProps {
    text?: string;
    onClick?: () => void;
    selected?: boolean;
}

const ClickableText: React.FC<ClickableTextProps> = ({ text = 'Devenir partenaire', onClick, selected = false }) => {
    return (
        <button onClick={onClick} className="group px-4 py-1 rounded-full inline-flex items-center justify-center transition-colors duration-200">
            <span className={`text-black text-base font-normal font-['Inter'] transition-all duration-200 ${selected ? 'underline' : 'group-hover:underline'}`}>
                {text}
            </span>
        </button>
    );
};

export default ClickableText;
