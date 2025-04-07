import React from 'react';
import Button from './Buttons/Button';

const SignupForm: React.FC = () => {
    return (
        <div className="flex flex-col items-center gap-7">
            {/* Partie sticky */}
            <div className="w-full z-10 pt-5 pb-3">
                <h2 className="text-4xl text-black font-normal text-center">Création de compte</h2>
                <div className="mt-3 w-full h-px outline-1 outline-black" />
            </div>

            {/* Champs de formulaire */}
            <div className="flex flex-col gap-4 w-full items-center px-4 pb-4">
                {[
                    { label: 'Username', type: 'text' },
                    { label: 'Email', type: 'email' },
                    { label: 'Mot de passe', type: 'password' },
                    { label: 'Confirmer le mot de passe', type: 'password' },
                    { label: 'Numéro de téléphone', type: 'tel' },
                    { label: 'Code de parrainage', type: 'text' },
                ].map((field, idx) => (
                    <div key={idx} className="w-full flex flex-col gap-[5px]">
                        <label className="text-2xl text-black">{field.label} :</label>
                        <input type={field.type} className="w-80 h-14 px-7 py-3 bg-white rounded-[20px] shadow outline-1 outline-black text-2xl text-black" />
                    </div>
                ))}
            </div>

            {/* Bouton valider */}
            <div className="pb-4">
                <Button text="Validé" />
            </div>
        </div>
    );
};

export default SignupForm;
