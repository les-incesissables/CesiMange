import * as React from 'react';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import '@les-incesissables/cesimange-ui-library/style.css';

import { Button, ButtonProps } from '@les-incesissables/cesimange-ui-library';

export const Route = createRootRoute({
    component: RootComponent,
});

function RootComponent() {
    // Déclaration d'un objet conforme à ButtonProps
    // On peut définir un objet ButtonProps explicitement
    const buttonProps: ButtonProps = {
        label: 'Cliquez-moi',
        variant: 'solid', // doit être l'une des valeurs: "solid", "outline", "ghost"
        size: 'md', // "xs", "sm", "md", "lg", "xl"
        colorscheme: 'blue', // "blackYellow", "red", "blue", "green"
        selected: false,
        rounded: 'full', // "xs", "sm", "md", "lg", "xl", "full"
        defaultBg: 'bg-blue-500',
        hoverBg: 'hover:bg-blue-600',
    };

    return (
        <React.Fragment>
            <div>Hello "__root"!</div>
            <Button
                onClick={() => {
                    console.log('test');
                }}
                label="teqs sdfsdf sdffqsf st"
            />
            <Outlet />
        </React.Fragment>
    );
}
