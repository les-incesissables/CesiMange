// src/context/AuthContext.tsx

import React, { useState, createContext, useCallback, useContext, useEffect, ReactNode, Dispatch, SetStateAction, FC } from 'react';
import moment from 'moment';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
/* import { getMe } from 'api/users'; */
// import { SocketContext, ISocketContext } from './SocketContext';

// Interface représentant l'utilisateur
export interface User {
    id: number;
    // Autres propriétés selon vos besoins...
}

// Interface pour l'état d'authentification
export interface AuthState {
    me: User | null;
    isLogged: boolean;
}

// Interface pour les props du provider Auth
interface AuthProviderProps {
    children: ReactNode;
}

// Valeur par défaut pour l'état d'authentification
const defaultAuthState: AuthState = {
    me: null,
    isLogged: false,
};

// Type du contexte Auth sous forme d'un tuple :
// [authState, setAuthState, refresh]
export type AuthContextType = [AuthState, Dispatch<SetStateAction<AuthState>>, () => AuthState];

// Création du contexte Auth avec une valeur par défaut
export const AuthContext = createContext<AuthContextType>([defaultAuthState, () => {}, () => defaultAuthState]);

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    // Désactivation des avertissements de dépréciation de Moment.js
    moment.suppressDeprecationWarnings = true;

    // Récupération du contexte socket
    //const socket = useContext<ISocketContext>(SocketContext);

    // Fonction utilitaire pour vérifier la présence d'un utilisateur dans le localStorage
    const isLogged = (): boolean => {
        const userStr = localStorage.getItem('user');
        return !!userStr;
    };

    // Initialisation de l'état d'authentification
    const [authState, setAuthState] = useState<AuthState>({
        me: null,
        isLogged: isLogged(),
    });

    // Utilisation explicite du type UseQueryResult pour récupérer les données utilisateur
    const meQuery: UseQueryResult<User, Error> = useQuery<User, Error>({
        queryKey: ['me'],
        queryFn: async () => {
            // TODO: Implémenter l'appel API pour récupérer l'utilisateur
            // Pour l'instant, nous retournons un objet vide casté en User.
            return {} as User;
        },
        enabled: typeof window !== 'undefined' ? !window.location.pathname.includes('dashboard/profil') && isLogged() : false,
        staleTime: 1000,
    });

    // En cas d'erreur dans la requête, suppression des données du localStorage
    useEffect(() => {
        if (meQuery.isError) {
            localStorage.removeItem('user');
            localStorage.removeItem('timeSession');
            setAuthState({ me: null, isLogged: false });
        }
    }, [meQuery.isError]);

    // Mise à jour de l'état d'authentification en fonction des données récupérées
    const setMe = useCallback(() => {
        if (meQuery.isSuccess && meQuery.data) {
            const currentTime = moment();
            const timeSessionStr = localStorage.getItem('timeSession');
            const timeSession = timeSessionStr ? moment(timeSessionStr) : moment().subtract(1, 'minute');

            if (isLogged() && currentTime.isBefore(timeSession, 'minute')) {
                //socket.send('userConnect', { id: meQuery.data.id });
                setAuthState({ me: meQuery.data, isLogged: true });
            } else {
                localStorage.removeItem('user');
                localStorage.removeItem('timeSession');
                setAuthState({ me: null, isLogged: false });
            }
        } else if (meQuery.isError) {
            localStorage.removeItem('user');
            localStorage.removeItem('timeSession');
            setAuthState({ me: null, isLogged: false });
        }
    }, [meQuery.isSuccess, meQuery.data, meQuery.isError]);

    // Fonction pour rafraîchir les données utilisateur
    const refresh = (): AuthState => {
        meQuery.refetch();
        return authState;
    };

    useEffect(() => {
        setMe();
    }, [setMe]);

    return <AuthContext.Provider value={[authState, setAuthState, refresh]}>{children}</AuthContext.Provider>;
};
