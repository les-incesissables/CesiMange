import { createFileRoute } from '@tanstack/react-router';
import Home from '../pages/Home';

export const Route = createFileRoute('/home')({
    component: Home,
});

/* function RouteComponent() {
    return <div>Hello "/home"!</div>;
}
 */
