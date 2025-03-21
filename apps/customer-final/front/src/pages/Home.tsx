import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { LocalMiddleware } from '../../../middleware/src/LocalMiddleware';

// Instanciation du middleware local (vous pouvez le faire via un contexte pour éviter des recréations multiples)
const localMiddleware = new LocalMiddleware();

export const Home: React.FC = () => {
    // Utilisation de useQuery pour récupérer la liste des utilisateurs via le middleware local
    const { data, isLoading, error } = useQuery({
        queryKey: ['users'],
        queryFn: () => localMiddleware.getUsers(),
    });

    if (isLoading) return <div>Loading users...</div>;
    if (error) return <div>Error: {(error as Error).message}</div>;

    // La réponse normalisée renvoyée par getUsers() devrait contenir un champ data avec la liste des utilisateurs
    const users = data?.data || [];

    return (
        <div>
            <h1>Users List</h1>
            <ul>
                {users && Array.isArray(users) ? (
                    users.map((user: any) => (
                        <li key={user.id}>
                            {user.name} ({user.email})
                        </li>
                    ))
                ) : (
                    <li>No users found.</li>
                )}
            </ul>
        </div>
    );
};

export default Home;
