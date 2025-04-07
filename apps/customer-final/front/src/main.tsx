import ReactDOM from 'react-dom/client';

import { BrowserRouter, Route, Routes } from 'react-router';

import './index.css';
import Welcome from './pages/Welcome';
import Home from './pages/Home';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

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
                </Routes>
            </QueryClientProvider>
        </BrowserRouter>,
    );
}
