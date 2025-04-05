import type { Meta, StoryObj } from '@storybook/react';
import InputField from '.';

const meta: Meta<typeof InputField> = {
    title: 'Components/InputField',
    component: InputField,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};

export default meta;
type Story = StoryObj<typeof InputField>;

export const Default: Story = {
    args: {
        type: 'text',
        placeholder: 'Entrez du texte',
    },
};

export const Password: Story = {
    args: {
        type: 'password',
        placeholder: 'Mot de passe',
    },
};

export const Email: Story = {
    args: {
        type: 'email',
        placeholder: 'Adresse e-mail',
    },
};
