'use client';
import React, { useContext, useState } from 'react';
import DashBoardLayout from '../../layout/DashBoardLayout';
import Button from '../../components/Buttons/Button';
import InputBox from '../../components/Utils/input';
import useAuth from '../../hooks/useAuth';
import Modal from '../../components/Utils/Modal';

import { localMiddlewareInstance } from 'customer-final-middleware';
import { AuthContext, AuthContextType } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const DashBoardAccount: React.FC = () => {
    const { authState } = useContext<AuthContextType>(AuthContext);

    const [openConfirmDeleteAccount, setOpenConfirmDeleteAccount] = useState<boolean>(false);

    const { logout } = useAuth();

    const handleDeleteAccount = async (): Promise<void> => {
        setOpenConfirmDeleteAccount(false);
        console.log('authState in dashboard account :', authState);
        // Vérification explicite : me?.id doit exister
        if (authState.isLogged && authState.me && authState.me.id) {
            console.log('ok');
            const userId = authState.me.id;
            const response = await localMiddlewareInstance.callLocalApi(async () => {
                return await localMiddlewareInstance.AuthRepo.deleteItem(userId.toString());
            });

            if (response.status === 'success') {
                await logout();
            } else {
                toast('Une erreur est survenue', { type: 'error' });
            }
        } else {
            toast('Une erreur est survenue', { type: 'error' });
        }
    };

    return (
        <DashBoardLayout>
            <Modal
                title="Supprimer mon compte"
                isOpen={openConfirmDeleteAccount}
                onClose={() => setOpenConfirmDeleteAccount(false)}
                onConfirm={{
                    label: 'Supprimer',
                    onClick: handleDeleteAccount,
                }}
            >
                <p>Voulez-vous vraiment supprimer votre compte CesiMange ?</p>
            </Modal>

            <div className="w-full min-h-screen bg-[#E4DBC7] px-2 lg:px-12 pt-8 sm:pt-12 flex flex-col gap-6 sm:gap-10 overflow-y-auto">
                {/* Titre de la page */}
                <div className="flex flex-col gap-2 sm:gap-5">
                    <h1 className="text-3xl sm:text-4xl font-bold text-black font-['Inter']">Mon Compte</h1>
                    <hr className="border-black/50" />
                </div>

                {/* Conteneur principal */}
                <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8 pb-12">
                    {/* Nom */}
                    <div className="w-full flex flex-col lg:flex-row gap-2 lg:gap-4 items-start">
                        <label className="text-black text-2xl font-normal font-['Inter'] w-full sm:w-1/3">Username</label>
                        <div className="w-full sm:w-2/3">
                            <InputBox />
                        </div>
                    </div>

                    {/* Adresse mail */}
                    <div className="w-full flex flex-col lg:flex-row gap-2 lg:gap-4 items-start">
                        <label className="text-black text-2xl font-normal font-['Inter'] w-full sm:w-1/3">Adresse mail</label>
                        <div className="w-full sm:w-2/3">
                            <InputBox />
                        </div>
                    </div>

                    {/* Numéro de téléphone */}
                    <div className="w-full flex flex-col lg:flex-row gap-2 lg:gap-4 items-start">
                        <label className="text-black text-2xl font-normal font-['Inter'] w-full sm:w-1/3">Numéro de téléphone</label>
                        <div className="w-full sm:w-2/3">
                            <InputBox />
                        </div>
                    </div>

                    {/* Photo de profil */}
                    <div className="w-full flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center justify-between">
                        <div className="flex flex-col gap-3 w-full sm:w-1/3">
                            <label className="text-black text-2xl font-normal font-['Inter']">Photo de profil</label>
                            <Button text="Changer de logo" />
                        </div>
                        <img className="w-32 h-32 rounded-[5px] border border-black object-cover" src="https://placehold.co/130x130" alt="avatar" />
                    </div>

                    {/* Boutons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
                        <Button text="Valider les changements" />
                    </div>
                    {/* Bouton Supprimer le compte */}
                    <div className="justify-center">
                        <Button onClick={() => setOpenConfirmDeleteAccount(true)} text="Supprimer le compte" bg="bg-red-600" />
                    </div>
                </div>
            </div>
        </DashBoardLayout>
    );
};

export default DashBoardAccount;
