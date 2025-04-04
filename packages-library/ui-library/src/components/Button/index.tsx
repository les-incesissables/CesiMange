'use client';
import React from 'react';

export interface ButtonProps {
    text?: string;
    selected?: boolean;
    onClick?: () => void;
    className?: string; // utile pour Storybook + personnalisation
}

const Button: React.FC<ButtonProps> = ({ text = 'button', selected = false, onClick, className = '' }) => {
    const baseClasses = 'group h-9 px-4 py-4 rounded-[20px] inline-flex justify-center items-center gap-2.5 transition-all duration-300 w-full';

    const defaultBg = 'bg-black';
    const defaultText = 'text-white';
    const hoverBg = 'hover:bg-yellow-400';

    const selectedBg = 'bg-yellow-400'; // Assurez-vous que cette classe existe dans Tailwind config
    const selectedText = 'text-black';

    const bgClass = selected ? selectedBg : defaultBg;
    const textClass = selected ? selectedText : defaultText;
    const hoverClass = selected ? '' : hoverBg;

    return (
        <button onClick={onClick} className={`${baseClasses} ${bgClass} ${hoverClass} ${className}`}>
            <span className={`flex w-full justify-center font-['Inter'] text-base font-bold ${textClass} transition-all duration-300 group-hover:text-black`}>
                {text}
            </span>
        </button>
    );
};

export default Button;
