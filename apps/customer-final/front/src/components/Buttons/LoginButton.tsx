'use client';
import React from 'react';

interface LoginButtonProps {
    text?: string;
    onClick?: () => void;
}

const LoginButton: React.FC<LoginButtonProps> = ({ text = 'Se connecter', onClick }) => {
    return (
        <button
            onClick={onClick}
            className="group  h-full p-4 bg-black rounded-lg flex items-center justify-center gap-2.5 transition-all duration-300 hover:bg-black/60 hover:inline-flex"
        >
            <div className="w-full flex justify-center text-white text-xl font-normal font-['Inter'] transition-all duration-300 group-hover:justify-start">
                {text}
            </div>
        </button>
    );
};

export default LoginButton;
