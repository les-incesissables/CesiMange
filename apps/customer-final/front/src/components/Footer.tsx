'use client';
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="w-full bg-yellow-400 border-t border-black">
            <div className="max-w-screen-xl mx-auto flex flex-col">
                {/* Section principale du footer */}
                <div className="p-3 border-t border-b border-black">
                    <div className="flex flex-col sm:flex-row justify-around items-center gap-6">
                        {/* Bloc CesiMange */}
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <div className="h-24 px-4 py-3 bg-stone-300 rounded-[20px] shadow-md border border-black flex flex-col justify-center items-start">
                                <div className="text-black text-xl font-bold font-['Inter'] underline">CesiMange</div>
                                <div className="text-black text-base font-normal font-['Inter']">Parc des Tanneries, 2 All. des Foulons, 67380 Lingolsheim</div>
                            </div>
                            {/* Bloc Contact */}
                            <div className="h-24 px-4 py-3 bg-stone-300 rounded-[20px] shadow-md border border-black flex flex-col items-center justify-center gap-2">
                                <div className="w-full text-black text-xl font-bold font-['Inter'] underline text-left">Contact</div>
                                <div className="w-full flex items-center gap-2">
                                    <span className="text-black text-base font-normal font-['Inter']">Email :</span>
                                    <div className="flex-1 h-7 rounded-[20px] flex items-center justify-center">
                                        <span className="text-black text-base font-normal font-['Inter']">cesimange.bureau@gmail.com</span>
                                    </div>
                                </div>
                            </div>
                            {/* Bloc Suivez-nous */}
                            <div className="h-24 px-3 py-2.5 bg-stone-300 rounded-[20px] shadow-md border border-black flex flex-col items-center justify-center gap-2">
                                <div className="w-full text-black text-xl font-bold font-['Inter'] underline text-left">Suivez-nous</div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 relative opacity-50 overflow-hidden">
                                        <img src="/images/facebook.svg" />
                                    </div>
                                    <div className="w-10 h-10 relative opacity-50 overflow-hidden">
                                        <img src="/images/instagram.svg" />
                                    </div>
                                    <div className="w-10 h-10 relative opacity-50 overflow-hidden">
                                        <img src="/images/linkedin.svg" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section inférieure du footer */}
                    <div className="h-20 p-3 bg-yellow-400 flex justify-center items-center">
                        <div className="text-black text-base font-normal font-['Inter'] leading-none text-center">
                            © 2025 CesiMange. Tous droits réservés.
                            <br />
                            <span className="underline">Mentions légales • Politique de confidentialité • CGU</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
