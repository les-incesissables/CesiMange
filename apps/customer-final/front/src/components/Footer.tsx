'use client';
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="w-full bg-yellow-400 border-t border-black">
            <div className="max-w-[1440px] mx-auto flex flex-col">
                {/* Section principale du footer */}
                <div className="p-2.5 border-t border-b border-black flex flex-col items-center gap-4">
                    <div className="flex flex-wrap justify-center gap-8">
                        {/* Bloc CesiMange */}
                        <div className="h-24 px-4 py-3 bg-stone-300 rounded-[20px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-black flex flex-col justify-center items-start gap-2">
                            <div className="w-28">
                                <div className="text-black text-xl font-bold font-['Inter'] underline">CesiMange</div>
                            </div>
                            <div className="w-72 text-black text-base font-normal font-['Inter']">
                                Parc des Tanneries, 2 All. des Foulons, 67380 Lingolsheim
                            </div>
                        </div>
                        {/* Bloc Contact */}
                        <div className="h-24 px-4 py-3 bg-stone-300 rounded-[20px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-black flex flex-col justify-center items-center gap-2">
                            <div className="w-full text-black text-xl font-bold font-['Inter'] underline text-left">Contact</div>
                            <div className="w-72 flex items-center gap-2">
                                <span className="text-black text-base font-normal font-['Inter']">Email :</span>
                                <div className="flex-1 h-7 rounded-[20px] flex justify-center items-center">
                                    <span className="text-black text-base font-normal font-['Inter']">cesimange.bureau@gmail.com</span>
                                </div>
                            </div>
                        </div>
                        {/* Bloc Suivez-nous */}
                        <div className="h-24 px-3 py-2.5 bg-stone-300 rounded-[20px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-black flex flex-col justify-center items-center gap-2">
                            <div className="w-40 flex flex-wrap justify-start items-end gap-5">
                                <div className="w-28 flex flex-col justify-start items-start gap-2">
                                    <div className="w-36 text-black text-xl font-bold font-['Inter'] underline">Suivez-nous</div>
                                </div>
                                <div className="w-10 h-10 relative opacity-50 overflow-hidden">
                                    <div className="w-5 h-8 absolute left-[11.67px] top-[3.33px] outline outline-4 outline-offset-[-2px] outline-Icon-Default-Default" />
                                </div>
                                <div className="w-10 h-10 relative opacity-50 overflow-hidden">
                                    <div className="w-8 h-8 absolute left-[3.33px] top-[3.33px] outline outline-4 outline-offset-[-2px] outline-Icon-Default-Default" />
                                </div>
                                <div className="w-10 h-10 relative opacity-50 overflow-hidden">
                                    <div className="w-8 h-8 absolute left-[3.33px] top-[3.33px] outline outline-4 outline-offset-[-2px] outline-Icon-Default-Default" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Section inférieure du footer */}
                <div className="h-20 p-2.5 bg-yellow-400 flex justify-center items-center">
                    <div className="text-black text-base font-normal font-['Inter'] leading-none text-center">
                        © 2025 CesiMange. Tous droits réservés.
                        <br />
                        <span className="underline">Mentions légales Politique de confidentialité CGU</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
