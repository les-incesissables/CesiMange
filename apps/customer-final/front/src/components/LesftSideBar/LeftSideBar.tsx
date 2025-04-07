'use client';
import React from 'react';

const LeftSidebar: React.FC = () => {
    return (
        <aside className="sticky top-16 w-80 h-[calc(100vh-4rem)] p-6 py-12 border-r flex flex-col gap-6 overflow-y-auto">
            <div className="overflow-y-auto bg-gray-200 border p-5 rounded-2xl flex flex-col gap-6">
                <h2 className="text-xl font-bold text-gray-800 underline text-center">Keyword</h2>

                <div className="flex gap-2 flex-wrap">
                    {['€€', '€'].map((item, idx) => (
                        <span key={idx} className="px-2 py-1 bg-yellow-400 rounded-full border border-gray-300 text-sm flex gap-1 items-center">
                            <span>{item}</span>
                            <span>x</span>
                        </span>
                    ))}
                </div>

                <hr className="border-gray-200" />

                <div className="flex flex-col gap-3">
                    <span className="text-gray-600 font-medium">Prix</span>

                    {['€€€', '€€', '€'].map((price, idx) => (
                        <label key={idx} className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="accent-indigo-500 rounded" />
                            <span className="text-gray-700 text-sm">{price}</span>
                        </label>
                    ))}
                </div>

                <hr className="border-gray-200" />

                <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Frais de livraison</span>
                        <span className="text-gray-500">$3 - $7+</span>
                    </div>
                    <div className="relative h-2 bg-gray-200 rounded-full">
                        <div className="absolute -top-1 left-0 w-4 h-4 bg-indigo-500 rounded-full shadow" />
                        <div className="absolute -top-1 right-0 w-4 h-4 bg-indigo-500 rounded-full shadow" />
                    </div>
                </div>

                <hr className="border-gray-200" />

                <div className="flex flex-col gap-3">
                    {[1, 2, 3].map((_, idx) => (
                        <div key={idx} className="flex flex-col gap-1">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="accent-indigo-500 rounded" />
                                <span className="text-gray-700 text-sm">Label</span>
                            </label>
                            <span className="text-xs text-gray-500 ml-6">Description</span>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default LeftSidebar;
