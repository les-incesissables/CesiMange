'use client';
import React from 'react';

interface UserCardProps {
    imageUrl: string; // URL de l’avatar
    username: string; // Nom d’utilisateur
    email: string; // Adresse email
}

const UserCard: React.FC<UserCardProps> = ({ imageUrl, username, email }) => {
    return (
        <div className="w-60 h-20 p-2.5 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-black inline-flex flex-col justify-start items-start overflow-hidden">
            <div className="h-16 w-full inline-flex items-center gap-5">
                <img className="w-12 h-12 rounded-[20px] object-cover" src={imageUrl} alt={username} />
                <div className="flex-1 flex flex-col justify-center">
                    <div className="text-black text-2xl font-normal font-['Inter']">{username}</div>
                    <div className="text-black text-sm font-normal font-['Inter']">{email}</div>
                </div>
            </div>
        </div>
    );
};

export default UserCard;
