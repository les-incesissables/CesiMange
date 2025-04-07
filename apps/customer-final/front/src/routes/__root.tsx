// __root.tsx
import { Outlet, createRootRoute } from '@tanstack/react-router';

export const Route = createRootRoute({
    // On ne rend ici qu’un Outlet
    component: () => <Outlet />,
});
<<<<<<< HEAD
=======

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
>>>>>>> d4252847bbfee494beb1ef331e2af0b977925246
