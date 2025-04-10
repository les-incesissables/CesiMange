'use client';
import React from 'react';
import DashBoardLayout from '../../layout/DashBoardLayout';
import UserCardList from '../../components/List/UserList';
import InputBox from '../../components/Utils/input';
import Button from '../../components/Buttons/Button';

const DashBoardSponsorship: React.FC = () => {
    const codeParrainage = 'aaaa';

    // Fonction pour copier le code
    const handleCopy = () => {
        navigator.clipboard
            .writeText(codeParrainage)
            .then(() => {
                // Optionnel : afficher un toast ou message de succès
                console.log('Code copié !');
            })
            .catch((err) => {
                // Optionnel : gérer l'erreur
                console.error('Erreur lors de la copie :', err);
            });
    };

    return (
        <DashBoardLayout>
            <div className="w-full min-h-screen px-12 pt-12 bg-[#E4DBC7] flex flex-col gap-10 overflow-y-auto">
                {/* Titre principal */}
                <div className="flex flex-col gap-5">
                    <h1 className="text-4xl font-bold text-black font-['Inter']">Parrainage</h1>
                    <hr className="border-black" />
                </div>

                {/* Contenu principal */}
                <div className="flex flex-col items-center gap-5 pb-12">
                    {/* Section "Code de parrainage" + stats */}
                    <section className="rounded-[20px] outline outline-1 outline-black p-6 flex flex-col md:flex-row items-center gap-12">
                        {/* Bloc code de parrainage */}
                        <div className="flex flex-col items-center gap-5">
                            <h2 className="text-center text-black text-2xl font-normal font-['Inter']">Code de parrainage</h2>
                            {/* Champ en lecture seule avec la valeur */}
                            <InputBox readOnly value={codeParrainage} />

                            <div>
                                <Button text="Copier" onClick={handleCopy} />
                            </div>
                        </div>

                        {/* Bloc statistiques (Nombre de parrainage / Argent) */}
                        <div className="flex flex-col items-center md:items-start gap-4">
                            <div className="w-96 h-24 bg-white rounded-[20px] outline-1 outline-black flex flex-col items-center justify-center shadow-md">
                                <div className="text-black text-3xl font-bold font-['Inter'] text-center">Nombre de parrainages:</div>
                                <div className="text-black text-2xl font-normal font-['Inter']">Nombre</div>
                            </div>
                            <div className="w-96 h-24 bg-white rounded-[20px] outline-1 outline-black flex flex-col items-center justify-center shadow-md">
                                <div className="text-black text-3xl font-bold font-['Inter'] text-center">Argent:</div>
                                <div className="text-black text-2xl font-normal font-['Inter']">Nombre</div>
                            </div>
                        </div>
                    </section>

                    {/* Liste d'utilisateurs parrainés */}
                    <section className="w-[874px] h-96 inline-flex flex-col gap-5">
                        <h2 className="text-black text-2xl font-semibold font-['Inter']">Parrainés</h2>
                        <div className="flex-1 overflow-y-auto border border-black rounded-md p-4">
                            <UserCardList />
                        </div>
                    </section>
                </div>
            </div>
        </DashBoardLayout>
    );
};

export default DashBoardSponsorship;
