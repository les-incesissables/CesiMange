'use client';
import React from 'react';
import { useCart } from '../context/CartContext';
import Button from './Buttons/Button';

interface CartPopupProps {
    onClose: () => void;
}

const CartPopup: React.FC<CartPopupProps> = ({ onClose }) => {
    const { cart, increment, decrement, removeItem } = useCart();

    // Calcul du nombre total d'articles (quantités cumulées)
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        // Fond semi-transparent qui recouvre toute la page
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={onClose} // Fermeture en cliquant en dehors du contenu
        >
            {/* Contenu de la popup avec stopPropagation pour éviter la fermeture en cliquant à l'intérieur */}
            <div className="bg-white rounded-lg p-6 w-11/12 max-w-lg" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4">Contenu du Panier</h2>
                {cart.length === 0 ? (
                    <p>Votre panier est vide.</p>
                ) : (
                    <ul className="space-y-2">
                        {cart.map((item) => (
                            <li key={item.name} className="flex items-center justify-between border-b pb-2">
                                <div className="flex-1">
                                    <span className="font-medium">{item.name}</span>
                                </div>
                                <div className="flex-1">
                                    <span className="font-normal">{item.price}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="px-2 py-1 bg-gray-200 rounded" onClick={() => decrement(item.name)}>
                                        -
                                    </button>
                                    <span className="text-sm">{item.quantity}</span>
                                    <button className="px-2 py-1 bg-gray-200 rounded" onClick={() => increment(item.name)}>
                                        +
                                    </button>
                                    <button className="px-2 py-1 bg-red-200 rounded ml-2 text-sm" onClick={() => removeItem(item.name)}>
                                        x
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                <div className="mt-6 flex justify-between items-center">
                    <p className="font-bold">Total d'articles: {totalItems}</p>
                    <p className="font-bold ">Prix total: {totalPrice}€ </p>
                </div>
                <div className="mt-6 flex justify-center items-center">
                    <Button text="Passer au payement" />
                </div>
            </div>
        </div>
    );
};

export default CartPopup;
