/**
 * Button.styles.ts
 *
 * Configuration des styles du composant Button avec class-variance-authority.
 * Gère :
 * - variant : solid, outline, ghost
 * - size : xs, sm, md, lg, xl
 * - colorscheme : blackYellow, red, blue, green
 * - selected : false ou true
 * - rounded : xs, sm, md, lg, xl, full
 *
 * Les compoundVariants définissent les classes spécifiques pour chaque combinaison.
 */

import { cva } from 'class-variance-authority';

export const buttonStyles = cva(
    // Classes de base pour tous les boutons
    'group inline-flex justify-center items-center gap-2.5 transition-all duration-300 focus:outline-none disabled:cursor-not-allowed font-semibold',
    {
        variants: {
            variant: {
                solid: '',
                outline: 'border-2',
                ghost: 'transition-colors duration-300',
            },
            size: {
                xs: 'h-7 px-2 py-1 text-xs',
                sm: 'h-8 px-3 py-2 text-sm',
                md: 'h-9 px-4 py-2 text-base',
                lg: 'h-10 px-6 py-3 text-lg',
                xl: 'h-11 px-8 py-4 text-xl',
            },
            colorscheme: {
                blackYellow: '',
                red: '',
                blue: '',
                green: '',
            },
            selected: {
                false: '',
                true: '',
            },
            // Nouveau variant pour la bordure arrondie
            rounded: {
                xs: 'rounded-xs',
                sm: 'rounded-sm',
                md: 'rounded-md',
                lg: 'rounded-lg',
                xl: 'rounded-xl',
                full: 'rounded-full',
            },
        },
        compoundVariants: [
            // ----- SOLID -----
            // Schéma blackYellow
            {
                variant: 'solid',
                colorscheme: 'blackYellow',
                selected: false,
                className: 'bg-black text-white hover:bg-goldenYellow hover:text-black',
            },
            {
                variant: 'solid',
                colorscheme: 'blackYellow',
                selected: true,
                className: 'bg-yellow-400 text-black',
            },
            // Schéma red
            {
                variant: 'solid',
                colorscheme: 'red',
                selected: false,
                className: 'bg-red-500 text-white hover:bg-red-600',
            },
            {
                variant: 'solid',
                colorscheme: 'red',
                selected: true,
                className: 'bg-red-400 text-white',
            },
            // Schéma blue
            {
                variant: 'solid',
                colorscheme: 'blue',
                selected: false,
                className: 'bg-blue-500 text-white hover:bg-blue-600',
            },
            {
                variant: 'solid',
                colorscheme: 'blue',
                selected: true,
                className: 'bg-blue-400 text-white',
            },
            // Schéma green
            {
                variant: 'solid',
                colorscheme: 'green',
                selected: false,
                className: 'bg-green-500 text-white hover:bg-green-600',
            },
            {
                variant: 'solid',
                colorscheme: 'green',
                selected: true,
                className: 'bg-green-400 text-white',
            },

            // ----- OUTLINE -----
            // blackYellow
            {
                variant: 'outline',
                colorscheme: 'blackYellow',
                selected: false,
                className: 'border-black text-black hover:bg-yellow-100',
            },
            {
                variant: 'outline',
                colorscheme: 'blackYellow',
                selected: true,
                className: 'border-yellow-400 text-yellow-600 bg-yellow-50',
            },
            // red
            {
                variant: 'outline',
                colorscheme: 'red',
                selected: false,
                className: 'border-red-500 text-red-500 hover:bg-red-100',
            },
            {
                variant: 'outline',
                colorscheme: 'red',
                selected: true,
                className: 'border-red-400 text-red-600 bg-red-50',
            },
            // blue
            {
                variant: 'outline',
                colorscheme: 'blue',
                selected: false,
                className: 'border-blue-500 text-blue-500 hover:bg-blue-100',
            },
            {
                variant: 'outline',
                colorscheme: 'blue',
                selected: true,
                className: 'border-blue-400 text-blue-600 bg-blue-50',
            },
            // green
            {
                variant: 'outline',
                colorscheme: 'green',
                selected: false,
                className: 'border-green-500 text-green-500 hover:bg-green-100',
            },
            {
                variant: 'outline',
                colorscheme: 'green',
                selected: true,
                className: 'border-green-400 text-green-600 bg-green-50',
            },

            // ----- GHOST -----
            // blackYellow
            {
                variant: 'ghost',
                colorscheme: 'blackYellow',
                selected: false,
                className: 'text-black bg-transparent hover:bg-yellow-100',
            },
            {
                variant: 'ghost',
                colorscheme: 'blackYellow',
                selected: true,
                className: 'bg-yellow-50 text-yellow-600',
            },
            // red
            {
                variant: 'ghost',
                colorscheme: 'red',
                selected: false,
                className: 'text-red-500 bg-transparent hover:bg-red-100',
            },
            {
                variant: 'ghost',
                colorscheme: 'red',
                selected: true,
                className: 'bg-red-50 text-red-600',
            },
            // blue
            {
                variant: 'ghost',
                colorscheme: 'blue',
                selected: false,
                className: 'text-blue-500 bg-transparent hover:bg-blue-100',
            },
            {
                variant: 'ghost',
                colorscheme: 'blue',
                selected: true,
                className: 'bg-blue-50 text-blue-600',
            },
            // green
            {
                variant: 'ghost',
                colorscheme: 'green',
                selected: false,
                className: 'text-green-500 bg-transparent hover:bg-green-100',
            },
            {
                variant: 'ghost',
                colorscheme: 'green',
                selected: true,
                className: 'bg-green-50 text-green-600',
            },
        ],
        // Valeurs par défaut
        defaultVariants: {
            variant: 'solid',
            size: 'md',
            colorscheme: 'blackYellow',
            selected: false,
            rounded: 'full', // On arrondit par défaut en "full"
        },
    },
);
