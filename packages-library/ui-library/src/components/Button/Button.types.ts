/**
 * Button.types.ts
 *
 * Définit les types et interfaces du composant Button.
 */

import { VariantProps } from 'class-variance-authority';
import { ComponentProps } from 'react';
import { buttonStyles } from './Button.styles';

export interface ButtonProps extends Omit<ComponentProps<'button'>, 'children'>, VariantProps<typeof buttonStyles> {
    /**
     * Le label du bouton.
     * S'il est vide ou contient uniquement des espaces, le bouton sera rendu comme un cercle.
     */
    label?: string;
    /**
     * Classe Tailwind pour surcharger la couleur de fond par défaut (ex: "bg-blue-500").
     * Par défaut, nous utilisons "bg-black".
     */
    defaultBg?: string;
    /**
     * Classe Tailwind pour surcharger la couleur de fond au survol (ex: "bg-goldenYellow" sans le préfixe "hover:").
     * Par défaut, nous utilisons "bg-goldenYellow".
     */
    hoverBg?: string;
}
