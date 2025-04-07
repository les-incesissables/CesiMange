'use client';
import React from 'react';

interface TriStateButtonProps {
    text?: string;
    selected?: boolean;
    onClick?: () => void;
}

const Button: React.FC<TriStateButtonProps> = ({ text = 'button', selected = false, onClick }) => {
    // Classes de base pour le bouton
    const baseClasses = 'group h-9 px-4 py-4 rounded-[20px] inline-flex justify-center items-center gap-2.5 transition-all duration-300';

    // Définition des classes de fond et de texte selon l'état sélectionné ou non
    const defaultBg = 'bg-black';
    const defaultText = 'text-white';
    const hoverBg = 'hover:bg-yellow-400';

    const selectedBg = 'bg-Jaune'; // Assurez-vous que cette classe est définie dans votre config Tailwind
    const selectedText = 'text-black';

    const bgClass = selected ? selectedBg : defaultBg;
    const textClass = selected ? selectedText : defaultText;
    const hoverClass = selected ? '' : hoverBg;

    return (
        <button onClick={onClick} className={`${baseClasses} ${bgClass} ${hoverClass} w-full`}>
            <div className={`flex w-full justify-center text-base font-bold font-['Inter'] ${textClass} transition-all duration-300 group-hover:text-black`}>
                {text}
            </div>
        </button>
    );
};

export default Button;
