// src/components/Footer.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import Footer from '.';

const meta: Meta<typeof Footer> = {
    title: 'Components/Footer',
    component: Footer,
    parameters: {
        layout: 'fullscreen', // Affiche le footer en pleine largeur dans la preview
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {};
