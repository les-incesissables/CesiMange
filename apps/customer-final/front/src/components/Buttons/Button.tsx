'use client';
import React from 'react';

interface TriStateButtonProps {
    text?: string;
    selected?: boolean;
    onClick?: () => void;
    bg?: string;
}

const Button: React.FC<TriStateButtonProps> = ({ text = 'button', selected = false, onClick, bg = 'bg-black' }) => {
    // Classes de base pour le bouton
    const baseClasses = `
    group
    h-9 sm:h-10
    w-full sm:w-auto
    px-3 sm:px-4
    py-2 sm:py-3
    rounded-[20px]
    inline-flex
    justify-center
    items-center
    gap-2.5
    transition-all
    duration-300
  `;

    // Définition des classes de fond et de texte selon l'état sélectionné ou non
    const defaultBg = bg; // Couleur de fond par défaut (ex: bg-black)
    const defaultText = 'text-white';
    const hoverBg = 'hover:bg-yellow-400';

    const selectedBg = 'bg-Jaune'; // Assurez-vous que cette classe est définie dans votre config Tailwind
    const selectedText = 'text-black';

    const bgClass = selected ? selectedBg : defaultBg;
    const textClass = selected ? selectedText : defaultText;
    const hoverClass = selected ? '' : hoverBg;

    return (
        <button onClick={onClick} className={`${baseClasses} ${bgClass} ${hoverClass}`}>
            <div
                className={`
          flex w-full sm:w-auto
          justify-center
          text-sm sm:text-base
          font-bold
          font-['Inter']
          ${textClass}
          transition-all
          duration-300
          group-hover:text-black
        `}
            >
                {text}
            </div>
        </button>
    );
};

export default Button;
