import ReactDOM from 'react-dom/client';

import { BrowserRouter, Route, Routes } from 'react-router';

import './index.css';
import Welcome from './pages/Welcome';
import Home from './pages/Home';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Restaurant from './pages/single/Restaurant';
import Dashboard from './pages/DashBoard/DashBoardAccount';
import DashBoardAccount from './pages/DashBoard/DashBoardAccount';
import DashboardOrder from './pages/DashBoard/DashBoardOrder';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5_000,
            refetchOnWindowFocus: false,
            refetchOnMount: 'always',
        },
    },
});

// Render the app
const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <Routes>
                    <Route path="/" element={<Welcome />} />
                    <Route path="/home" element={<Home />}></Route>
                    <Route path="/restaurants/:id" element={<Restaurant />}></Route>
                    <Route path="/dashboard/account" element={<DashBoardAccount />}></Route>
                    <Route path="/dashboard/order" element={<DashboardOrder />}></Route>
                    <Route path="/dashboard/favorites" element={<Dashboard />}></Route>
                    <Route path="/dashboard/sponsorship" element={<Dashboard />}></Route>
                </Routes>
            </QueryClientProvider>
        </BrowserRouter>,
    );
}
