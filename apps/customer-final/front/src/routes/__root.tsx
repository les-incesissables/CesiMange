// __root.tsx
import { Outlet, createRootRoute } from '@tanstack/react-router';

export const Route = createRootRoute({
    // On ne rend ici qu’un Outlet
    component: () => <Outlet />,
});
