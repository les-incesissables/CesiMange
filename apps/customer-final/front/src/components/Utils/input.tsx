'use client';
import React, { useState, ChangeEvent } from 'react';

interface InputBoxProps {
    value?: string; // Valeur initiale du champ
    onChange?: (val: string) => void; // Callback appelé lors d'une modification
    readOnly?: boolean; // Indique si l'input est non modifiable
}

const InputBox: React.FC<InputBoxProps> = ({
    value = '',
    onChange,
    readOnly = false, // Par défaut, "non modifiable"
}) => {
    const [localValue, setLocalValue] = useState<string>(value);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!readOnly) {
            const newValue = e.target.value;
            setLocalValue(newValue);
            onChange?.(newValue);
        }
    };

    return (
        <div
            className="
        w-full sm:w-96
        h-14
        px-7 py-3
        bg-white
        rounded-[20px]
        shadow-[0px_4px_4px_rgba(0,0,0,0.25)]
        outline outline-1 outline-offset-[-1px]
        outline-black
        inline-flex items-center gap-2.5
      "
        >
            <input
                type="text"
                value={localValue}
                onChange={handleChange}
                readOnly={readOnly}
                className="
          w-full
          bg-transparent
          border-none
          outline-none
          text-black
          text-2xl
          font-normal
          font-['Inter']
        "
            />
        </div>
    );
};

export default InputBox;
