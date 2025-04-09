'use client';
import React from 'react';
import UserAccountLayout from '../../layout/DashBoardLayout';
import OrderSection from '../../components/Sections/OrderSection';

const DashboardOrder: React.FC = () => {
    return (
        <UserAccountLayout>
            <div className="w-full min-h-screen px-12 pt-12 bg-[#E4DBC7] flex flex-col gap-10 overflow-y-auto">
                {/* Titre principal */}
                <div className="flex flex-col gap-5">
                    <h1 className="text-4xl font-bold text-black font-['Inter']">Mes commandes</h1>
                </div>

                <hr className="border-black" />

                {/* Contenu principal */}
                <div className="flex flex-col gap-10">
                    {/* Commande en cours */}
                    <section>
                        <h2 className="text-4xl font-bold text-black font-['Inter'] mb-4">Commande en cours</h2>
                        <OrderSection />
                    </section>

                    {/* Historique */}
                    <section>
                        <h2 className="text-4xl font-bold text-black font-['Inter'] mb-4">Historique</h2>
                        <OrderSection />
                    </section>
                </div>
            </div>
        </UserAccountLayout>
    );
};

export default DashboardOrder;
