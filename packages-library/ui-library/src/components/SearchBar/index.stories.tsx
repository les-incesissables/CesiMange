import type { Meta, StoryObj } from '@storybook/react';
import SearchBar from '.';

const meta: Meta<typeof SearchBar> = {
    title: 'Components/SearchBar',
    component: SearchBar,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {
    args: {
        textInput: 'input',
        textButton: 'Button',
        onClick: () => alert('Button appuyé'),
    },
};
