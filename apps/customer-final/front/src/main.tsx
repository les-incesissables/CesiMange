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
import { SocketProvider } from './context/SocketContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Utils/ProtectedRoute';

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
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <SocketProvider>
                    <AuthProvider>
                        <Routes>
                            <Route path="/" element={<Welcome />} />
                            <Route path="/home" element={<Home />} />
                            <Route path="/restaurants/:id" element={<Restaurant />} />

                            <Route path="dashboard">
                                <Route
                                    path="account"
                                    element={
                                        <ProtectedRoute>
                                            <DashBoardAccount />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="order"
                                    element={
                                        <ProtectedRoute>
                                            <DashboardOrder />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="favorites"
                                    element={
                                        <ProtectedRoute>
                                            <Dashboard />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="sponsorship"
                                    element={
                                        <ProtectedRoute>
                                            <Dashboard />
                                        </ProtectedRoute>
                                    }
                                />
                            </Route>
                        </Routes>
                    </AuthProvider>
                </SocketProvider>
            </BrowserRouter>
        </QueryClientProvider>,
    );
}
