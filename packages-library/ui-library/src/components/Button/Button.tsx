'use client';

import { cn } from '@/utils';
import { forwardRef } from 'react';
import { ButtonProps } from './Button.types';
import { buttonStyles } from './Button.styles';

/**
 * Composant Button réutilisable.
 *
 * - Gère les variantes (variant, size, colorscheme, selected, rounded) via cva.
 * - Permet de surcharger les couleurs via defaultBg et hoverBg.
 * - Si la prop text est vide, le bouton devient circulaire (en supprimant le padding et en fixant la largeur).
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            label = 'Button',
            variant,
            size,
            colorscheme,
            selected,
            rounded, // <-- On récupère "rounded" depuis la config cva
            defaultBg,
            hoverBg,
            className,
            ...props
        },
        ref,
    ) => {
        // Bouton circulaire si le texte est vide
        const isTextEmpty = !label || label.trim().length === 0;

        // Largeur pour un bouton circulaire (pour chaque size)
        const circleWidthMap: Record<string, string> = {
            xs: 'w-7',
            sm: 'w-8',
            md: 'w-10',
            lg: 'w-12',
            xl: 'w-14',
        };

        const circleWidth = circleWidthMap[size ?? 'md'] || '';

        return (
            <button
                ref={ref}
                onClick={props.onClick}
                className={cn(
                    // Applique les styles cva
                    buttonStyles({ variant, size, colorscheme, selected, rounded }),
                    // Si pas de texte, forcer un bouton circulaire
                    isTextEmpty ? `p-0 ${circleWidth}` : '',
                    // Surcharger la couleur de fond
                    defaultBg ? defaultBg : '',
                    // Surcharger la couleur au hover
                    hoverBg ? `hover:${hoverBg}` : '',
                    className,
                )}
                {...props}
            >
                <span className="font-['Inter'] font-bold transition-all duration-300">{label}</span>
            </button>
        );
    },
);

Button.displayName = 'Button';
export default Button;
