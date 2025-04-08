import ReactDOM from 'react-dom/client';

import { BrowserRouter, Route, Routes } from 'react-router';

import './index.css';
import Welcome from './pages/Welcome';
import Home from './pages/Home';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Restaurant from './pages/single/Restaurant';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 50000,
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
                </Routes>
            </QueryClientProvider>
        </BrowserRouter>,
    );
}
