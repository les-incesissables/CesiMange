import type { Meta, StoryObj } from '@storybook/react';
import Button from '.';

const meta: Meta<typeof Button> = {
    title: 'Components/Button',
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        text: 'Valider',
        selected: false,
    },
};

export const Selected: Story = {
    args: {
        text: 'Sélectionné',
        selected: true,
    },
};
