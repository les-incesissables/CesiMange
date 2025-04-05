import type { Meta, StoryObj } from '@storybook/react';
import ClickableText from '.';

const meta: Meta<typeof ClickableText> = {
    title: 'Components/ClickableText',
    component: ClickableText,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const CustomText: Story = {
    args: {
        text: 'Contactez-nous',
    },
};

export const WithLongText: Story = {
    args: {
        text: 'Cliquez ici pour en savoir plus sur nos services',
    },
};
