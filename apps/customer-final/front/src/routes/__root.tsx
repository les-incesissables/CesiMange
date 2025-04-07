import * as React from 'react';
import { Outlet, createRootRoute } from '@tanstack/react-router';

export const Route = createRootRoute({
    component: RootComponent,
});

function RootComponent() {
    // Déclaration d'un objet conforme à ButtonProps
    // On peut définir un objet ButtonProps explicitement

    return (
        <React.Fragment>
            <div>Hello "__root"!</div>
            <Outlet />
        </React.Fragment>
    );
}
