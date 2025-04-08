'use client';
import React from 'react';
import DashBoardLayout from '../../layout/DashBoardLayout';
import Button from '../../components/Buttons/Button';
import InputBox from '../../components/Utils/input';

const DashBoardAccount: React.FC = () => {
    return (
        <DashBoardLayout>
            <div className="w-full min-h-screen bg-[#E4DBC7] px-12 pt-12 flex flex-col gap-10 overflow-y-auto">
                {/* Titre de la page */}
                <div className="flex flex-col gap-5">
                    <h1 className="text-4xl font-bold text-black font-['Inter']">Mon Compte</h1>
                    <hr className="border-black/50" />
                </div>

                {/* Contenu principal */}
                <div className="flex flex-col items-center gap-12 pb-12">
                    {/* Bloc Nom */}
                    <div className="w-[800px] flex justify-between items-center">
                        <label className="flex-1 p-2.5 text-black text-2xl font-normal font-['Inter']">Username</label>
                        <InputBox />
                    </div>

                    {/* Bloc Adresses mail */}
                    <div className="w-[800px] flex justify-between items-center">
                        <label className="flex-1 p-2.5 text-black text-2xl font-normal font-['Inter']">Adresse mail</label>
                        <InputBox />
                    </div>

                    {/* Bloc Numéro de téléphone */}
                    <div className="w-[800px] flex justify-between items-center">
                        <label className="flex-1 p-2.5 text-black text-2xl font-normal font-['Inter']">Numéro de téléphone</label>
                        <InputBox />
                    </div>

                    {/* Bloc Photo de profil */}
                    <div className="w-[800px] flex justify-between items-center">
                        <div className="flex flex-col gap-3">
                            <label className="text-black text-2xl font-normal font-['Inter']">Photo de profil</label>
                            <Button text="Changer de logo" />
                        </div>
                        <img className="w-32 h-32 rounded-[5px] border border-black object-cover" src="https://placehold.co/130x130" alt="avatar" />
                    </div>

                    {/* Bouton Validation */}
                    <div className="justify-center">
                        <Button text="Valider les changements" />
                    </div>
                    {/* Bouton Supprimer le compte */}
                    <div className="justify-center">
                        <Button text="Supprimer le compte" bg="bg-red-600" />
                    </div>
                </div>
            </div>
        </DashBoardLayout>
    );
};

export default DashBoardAccount;
