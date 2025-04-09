'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { IArticles } from '../models/interfaces/IRestaurant/IArticles';
import { IMenu } from '../models/interfaces/IRestaurant/IMenu';

// Définition d'un type pour les articles du panier
type CartArticle = IArticles & {
    kind: 'article';
    quantity: number;
};

// Définition d'un type pour les menus du panier
type CartMenu = IMenu & {
    kind: 'menu';
    quantity: number;
};

// Type unifié des éléments du panier (union)
type CartItem = CartArticle | CartMenu;

interface CartContextValue {
    cart: CartItem[];
    addArticleToCart: (article: IArticles) => void;
    addMenuToCart: (menu: IMenu) => void;
    increment: (id: string) => void;
    decrement: (id: string) => void;
    removeItem: (id: string) => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    // Ajoute un article au panier
    const addArticleToCart = (article: IArticles) => {
        setCart((prevCart) => {
            const existingArticle = prevCart.find((item) => item.kind === 'article' && item.name === article.name);
            if (existingArticle && existingArticle.kind === 'article') {
                // Incrémente la quantité
                return prevCart.map((item) => (item.name === article.name && item.kind === 'article' ? { ...item, quantity: item.quantity + 1 } : item));
            }
            // Ajoute l'article avec quantity = 1
            const newArticle: CartArticle = {
                ...article,
                kind: 'article',
                quantity: 1,
            };
            return [...prevCart, newArticle];
        });
    };

    // Ajoute un menu au panier
    const addMenuToCart = (menu: IMenu) => {
        setCart((prevCart) => {
            const existingMenu = prevCart.find((item) => item.kind === 'menu' && item.name === menu.name);
            if (existingMenu && existingMenu.kind === 'menu') {
                return prevCart.map((item) => (item.name === menu.name && item.kind === 'menu' ? { ...item, quantity: item.quantity + 1 } : item));
            }
            const newMenu: CartMenu = {
                ...menu,
                kind: 'menu',
                quantity: 1,
            };
            return [...prevCart, newMenu];
        });
    };

    // Incrémente la quantité d’un élément (qu’il s’agisse d’un article ou d’un menu)
    const increment = (id: string) => {
        setCart((prevCart) => prevCart.map((item) => (item.name === id ? { ...item, quantity: item.quantity + 1 } : item)));
    };

    // Décrémente la quantité d’un élément ; si la quantité tombe à 0, il est retiré du panier
    const decrement = (id: string) => {
        setCart((prevCart) => prevCart.map((item) => (item.name === id ? { ...item, quantity: item.quantity - 1 } : item)).filter((item) => item.quantity > 0));
    };

    const removeItem = (id: string) => {
        setCart((prevCart) => prevCart.filter((item) => item.name !== id));
    };

    return <CartContext.Provider value={{ cart, addArticleToCart, addMenuToCart, increment, decrement, removeItem }}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart doit être utilisé dans un CartProvider');
    }
    return context;
};
