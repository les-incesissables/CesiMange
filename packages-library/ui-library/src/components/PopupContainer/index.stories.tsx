import type { Meta, StoryObj } from '@storybook/react';
import PopupContainer from '.';

const meta: Meta<typeof PopupContainer> = {
    title: 'Components/PopupContainer',
    component: PopupContainer,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        header: 'Titre de la popup',
        children: (
            <div className="text-base text-black">Ceci est le contenu principal de la popup. Tu peux y mettre des champs, des infos ou ce que tu veux.</div>
        ),
        footer: (
            <div className="flex justify-between px-4 text-sm text-black">
                <button className="hover:underline">Annuler</button>
                <button className="rounded-full bg-black px-4 py-2 font-bold text-white hover:bg-gray-800">Valider</button>
            </div>
        ),
    },
};
