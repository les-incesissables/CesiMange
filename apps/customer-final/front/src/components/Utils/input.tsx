'use client';
import React, { useState, ChangeEvent } from 'react';

interface InputBoxProps {
    value?: string; // Valeur initiale du champ
    className?: string; // Permet d'ajouter des classes supplémentaires si besoin
    onChange?: (val: string) => void; // Callback appelé lors d'une modification
}

const InputBox: React.FC<InputBoxProps> = ({ value = '', className = '', onChange }) => {
    const [localValue, setLocalValue] = useState<string>(value);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLocalValue(e.target.value);
        if (onChange) {
            onChange(e.target.value);
        }
    };

    return (
        <div
            className={`
        w-96 h-14 px-7 py-3 bg-white rounded-[20px]
        shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]
        outline outline-1 outline-offset-[-1px]
        outline-black inline-flex items-center gap-2.5
        ${className}
      `}
        >
            <input
                type="text"
                value={localValue}
                onChange={handleChange}
                className="w-full bg-transparent border-none outline-none text-black text-2xl font-normal font-['Inter']"
            />
        </div>
    );
};

export default InputBox;
