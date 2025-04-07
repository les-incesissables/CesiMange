import React from 'react';
import ClickableText from '../Buttons/ClickableText';
import Button from '../Buttons/Button';

interface AccountSidebarProps {
    onClose: () => void;
}

const AccountSidebar: React.FC<AccountSidebarProps> = ({}) => {
    const sections = [
        {
            items: [
                { icon: '/images/archive.svg', label: 'Mes commandes', center: false },
                { icon: '/images/heart.svg', label: 'Favoris', center: false },
                { icon: '/images/users.svg', label: 'Parrainage', center: false },
            ],
        },
        {
            items: [{ icon: null, label: 'Déconnexion', center: true }],
        },
        {
            items: [
                { icon: null, label: 'Ajoutez votre restaurant', center: false },
                { icon: null, label: 'Devenez coursier-partenaire', center: false },
            ],
        },
    ];

    return (
        <div className="fixed top-0 right-0 z-50 w-80 h-screen bg-[#E4DBC7] border-l border-black shadow-lg flex flex-col px-6 py-6 overflow-y-auto">
            {/* Titre */}
            <h2 className="text-3xl text-black text-center mb-4">Mon Compte</h2>

            {/* Gérer mon compte */}
            <div className="flex justify-center mb-4">
                <Button text="Gérer mon compte" />
            </div>

            <hr className="border-black mb-6" />

            {/* Sections */}
            {sections.map((section, sectionIdx) => (
                <div key={sectionIdx} className="mb-6">
                    <ul className="flex flex-col gap-4 text-xl">
                        {section.items.map(({ icon, label, center }, idx) => (
                            <li key={idx}>
                                {center ? (
                                    <div className="flex justify-center opacity-50">
                                        <ClickableText text={label} />
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 opacity-50">
                                        {icon && <img src={icon} alt={`${label} icon`} className="w-6 h-6 object-contain" />}
                                        <ClickableText text={label} />
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                    {/* Séparation */}
                    {sectionIdx < sections.length - 1 && <hr className="my-4 border-black" />}
                </div>
            ))}
        </div>
    );
};

export default AccountSidebar;
