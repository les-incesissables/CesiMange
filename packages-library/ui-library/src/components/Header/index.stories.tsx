// src/components/Header.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import Header from '.';

const meta: Meta<typeof Header> = {
    title: 'Components/Header',
    component: Header,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Header>;

export const General: Story = {
    args: {
        variant: 'general',
        onLoginClick: () => alert('Login clicked'),
    },
};

export const Client: Story = {
    args: {
        variant: 'client',
        onLoginClick: () => alert('Login clicked'),
        onBellClick: () => alert('Bell clicked'),
        onCartClick: () => alert('Cart clicked'),
    },
};
