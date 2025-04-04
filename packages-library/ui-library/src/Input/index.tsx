'use client';
import React from 'react';

interface InputFieldProps {
    type?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    name?: string;
}

const InputField: React.FC<InputFieldProps> = ({ type = 'text', value, onChange, placeholder = '', name }) => {
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            name={name}
            className="h-14 w-full rounded-[20px] bg-white px-6 text-2xl shadow outline outline-1 outline-black"
        />
    );
};

export default InputField;
