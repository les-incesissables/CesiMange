import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

/**
 * Configuration de la story pour Storybook.
 *
 * - title: Nom sous lequel le composant sera listé.
 * - component: Le composant Button.
 * - parameters: Options d'affichage (layout centré).
 * - argTypes: Contrôles et descriptions pour chaque prop.
 */
const meta: Meta<typeof Button> = {
    title: 'Components/Button',
    component: Button,
    parameters: { layout: 'centered' },
    argTypes: {
        label: {
            description: 'Le label du bouton. S’il est vide, le bouton sera rendu comme un cercle.',
            defaultValue: 'Button',
            control: 'text',
        },
        variant: {
            description: 'Type de bouton (solid, outline, ghost)',
            defaultValue: 'solid',
            control: 'select',
            options: ['solid', 'outline', 'ghost'],
        },
        size: {
            description: 'Taille du bouton (xs, sm, md, lg, xl)',
            defaultValue: 'md',
            control: 'select',
            options: ['xs', 'sm', 'md', 'lg', 'xl'],
        },
        colorscheme: {
            description: 'Schéma de couleurs (blackYellow, red, blue, green)',
            defaultValue: 'blackYellow',
            control: 'select',
            options: ['blackYellow', 'red', 'blue', 'green'],
        },
        selected: {
            description: 'État sélectionné du bouton (true = fond différent)',
            defaultValue: false,
            control: 'boolean',
        },
        // Nouveau paramètre "rounded"
        rounded: {
            description: 'Bordure arrondie du bouton (xs, sm, md, lg, xl, full)',
            defaultValue: 'full', // Valeur par défaut
            control: 'select',
            options: ['xs', 'sm', 'md', 'lg', 'xl', 'full'],
        },
        defaultBg: {
            description: 'Surcharge de la couleur de fond (ex: "bg-blue-500"). Par défaut, "bg-black".',
            defaultValue: 'bg-black',
            control: 'text',
        },
        hoverBg: {
            description: 'Surcharge de la couleur au survol (ex: "bg-goldenYellow"). Par défaut, "bg-goldenYellow".',
            defaultValue: 'bg-goldenYellow',
            control: 'text',
        },
        onClick: {
            description: 'Fonction appelée lors du clic sur le bouton',
            action: 'clicked',
        },
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

/**
 * Story par défaut : bouton non sélectionné avec label "Valider".
 */
export const Default: Story = {
    args: {
        label: 'Valider',
        selected: false,
    },
};

/**
 * Story pour un bouton sélectionné.
 */
export const Selected: Story = {
    args: {
        label: 'Sélectionné',
        selected: true,
    },
};

/**
 * Story illustrant la surcharge des couleurs par défaut et au survol.
 */
export const CustomColors: Story = {
    args: {
        label: 'Custom Colors',
        defaultBg: 'bg-purple-500',
        hoverBg: 'bg-pink-500',
    },
};

/**
 * Story pour tester différents schémas de couleurs.
 */
export const MultipleColorSchemes: Story = {
    args: {
        label: 'Multi Colors',
        variant: 'solid',
        size: 'md',
        colorscheme: 'blue',
    },
};

/**
 * Story pour un bouton circulaire (aucun texte).
 */
export const CircleButton: Story = {
    args: {
        label: '',
        variant: 'solid',
        size: 'md',
        colorscheme: 'green',
    },
};

/**
 * Story pour démontrer l'usage de "rounded".
 */
export const RoundedExamples: Story = {
    args: {
        label: 'Rounded Demo',
        variant: 'solid',
        size: 'md',
        colorscheme: 'blackYellow',
        rounded: 'xl', // On peut tester "xs", "md", "full", etc.
    },
};
