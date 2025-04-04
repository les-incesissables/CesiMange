'use client';
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="w-full border-t border-black bg-yellow-400">
            <div className="mx-auto flex max-w-[1440px] flex-col">
                {/* Section principale du footer */}
                <div className="flex flex-col items-center gap-4 border-t border-b border-black p-2.5">
                    <div className="flex flex-wrap justify-center gap-8">
                        {/* Bloc CesiMange */}
                        <div className="flex h-24 flex-col items-start justify-center gap-2 rounded-[20px] bg-stone-300 px-4 py-3 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-black">
                            <div className="w-28">
                                <div className="font-['Inter'] text-xl font-bold text-black underline">CesiMange</div>
                            </div>
                            <div className="w-72 font-['Inter'] text-base font-normal text-black">
                                Parc des Tanneries, 2 All. des Foulons, 67380 Lingolsheim
                            </div>
                        </div>
                        {/* Bloc Contact */}
                        <div className="flex h-24 flex-col items-center justify-center gap-2 rounded-[20px] bg-stone-300 px-4 py-3 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-black">
                            <div className="w-full text-left font-['Inter'] text-xl font-bold text-black underline">Contact</div>
                            <div className="flex w-72 items-center gap-2">
                                <span className="font-['Inter'] text-base font-normal text-black">Email :</span>
                                <div className="flex h-7 flex-1 items-center justify-center rounded-[20px]">
                                    <span className="font-['Inter'] text-base font-normal text-black">cesimange.bureau@gmail.com</span>
                                </div>
                            </div>
                        </div>
                        {/* Bloc Suivez-nous */}
                        <div className="flex h-24 flex-col items-center justify-center gap-2 rounded-[20px] bg-stone-300 px-3 py-2.5 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-black">
                            <div className="flex w-40 flex-wrap items-end justify-start gap-5">
                                <div className="flex w-28 flex-col items-start justify-start gap-2">
                                    <div className="w-36 font-['Inter'] text-xl font-bold text-black underline">Suivez-nous</div>
                                </div>
                                <img src="/images/facebook.svg" />
                                <img src="/images/instagram.svg" />
                                <img src="/images/linkedin.svg" />
                            </div>
                        </div>
                    </div>
                </div>
                {/* Section inférieure du footer */}
                <div className="flex h-20 items-center justify-center bg-yellow-400 p-2.5">
                    <div className="text-center font-['Inter'] text-base leading-none font-normal text-black">
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
