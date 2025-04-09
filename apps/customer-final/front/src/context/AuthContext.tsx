// src/context/AuthContext.tsx
import { createContext, useState, useContext, useCallback, useEffect, ReactNode, Dispatch, SetStateAction, FC } from 'react';
import moment from 'moment';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router';
import { SocketContext, ISocketContext } from './SocketContext';
import { toast } from 'react-toastify';

// ----- INTERFACES ----- //

/**
 * Représente un utilisateur. Ajoutez d'autres propriétés si nécessaire.
 */
export interface User {
    id: number;
    // Ex: name, email, etc.
}

/**
 * Représente l'état d'authentification.
 */
export interface AuthState {
    me: User | null;
    isLogged: boolean;
}

/**
 * Le contexte d'authentification fournit :
 * - l'état,
 * - la fonction de mise à jour,
 * - une méthode "refresh" qui déclenche un refetch des données utilisateur et retourne l'état actuel.
 */
export interface AuthContextType {
    authState: AuthState;
    setAuthState: Dispatch<SetStateAction<AuthState>>;
    refresh: () => AuthState;
}

// ----- VALEUR PAR DÉFAUT ----- //
const defaultAuthState: AuthState = {
    me: null,
    isLogged: false,
};

// ----- CRÉATION DU CONTEXTE ----- //
export const AuthContext = createContext<AuthContextType>({
    authState: defaultAuthState,
    setAuthState: () => {},
    refresh: () => defaultAuthState,
});

// ----- PROVIDER ----- //
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    // Désactivation des avertissements de Moment.js
    moment.suppressDeprecationWarnings = true;

    // Récupération du contexte Socket (pour notification serveur)
    const socket = useContext<ISocketContext>(SocketContext);

    // Hooks de routing
    const navigate = useNavigate();
    const location = useLocation();

    // Vérification rapide de la présence d'un utilisateur dans le localStorage
    const isUserLogged = (): boolean => !!localStorage.getItem('user');

    // État d'authentification local
    const [authState, setAuthState] = useState<AuthState>({
        me: null,
        isLogged: isUserLogged(),
    });

    // Utilisation de React Query pour récupérer l'utilisateur (query "me")
    const meQuery: UseQueryResult<User, Error> = useQuery<User, Error>({
        queryKey: ['me'],
        queryFn: async () => {
            // TODO: Remplacez cette ligne par votre appel API réel
            return {} as User;
        },
        enabled: typeof window !== 'undefined' ? !window.location.pathname.includes('dashboard/profil') && isUserLogged() : false,
        staleTime: 1000,
    });

    // Si la query rencontre une erreur, on nettoie la session
    useEffect(() => {
        if (meQuery.isError) {
            localStorage.removeItem('user');
            localStorage.removeItem('timeSession');
            localStorage.removeItem('xsrfToken');
            setAuthState({ me: null, isLogged: false });
        }
    }, [meQuery.isError]);

    // Fonction pour mettre à jour l'état d'authentification en fonction de la query
    const setMe = useCallback(() => {
        if (meQuery.isSuccess && meQuery.data) {
            const currentTime = moment();
            const timeSessionStr = localStorage.getItem('timeSession');
            const timeSession = timeSessionStr ? moment(timeSessionStr) : moment().subtract(1, 'minute');
            if (isUserLogged() && currentTime.isBefore(timeSession)) {
                console.log('Utilisateur connecté');
                setAuthState(() => ({ me: meQuery.data, isLogged: true }));
            } else {
                localStorage.removeItem('user');
                localStorage.removeItem('timeSession');
                localStorage.removeItem('xsrfToken');
                setAuthState(() => ({ me: null, isLogged: false }));
            }
        } else if (meQuery.isError) {
            localStorage.removeItem('user');
            localStorage.removeItem('timeSession');
            localStorage.removeItem('xsrfToken');
            setAuthState(() => ({ me: null, isLogged: false }));
        }
    }, [meQuery.isSuccess, meQuery.data, meQuery.isError]);

    // refresh : déclenche un refetch et retourne immédiatement l'état actuel.
    const refresh = useCallback((): AuthState => {
        console.log('refresh auth context');
        meQuery.refetch();
        return authState;
    }, [meQuery, authState]);

    // Met à jour authState lors des changements de meQuery
    useEffect(() => {
        setMe();
    }, [setMe]);

    // Vérification initiale de la session : si le token est absent ou expiré, déclencher logout
    useEffect(() => {
        const currentTime = moment();
        const timeSessionStr = localStorage.getItem('timeSession');
        const timeSession = timeSessionStr ? moment(timeSessionStr) : moment().subtract(1, 'minute');
        if (!localStorage.getItem('user') || currentTime.isAfter(timeSession)) {
            logout();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Écoute des changements dans le localStorage pour détecter la suppression du token CSRF
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'xsrfToken' && !e.newValue) {
                console.warn('Token CSRF supprimé, déclenchement du logout');
                logout();
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Fonction de déconnexion
    const logout = useCallback((): void => {
        localStorage.removeItem('user');
        localStorage.removeItem('timeSession');
        localStorage.removeItem('xsrfToken');

        // Mise à jour fonctionnelle de l'état d'authentification
        setAuthState((prev) => ({ ...prev, me: null, isLogged: false }));

        // Notifier le serveur via socket s'il y avait un utilisateur connecté
        setAuthState((prev) => {
            if (prev.me?.id) {
                socket.send('userLogout', { id: prev.me.id });
            }
            return { ...prev, me: null, isLogged: false };
        });
        socket.send('userLogout', { id: authState?.me?.id });
        socket.off('userConnect');
        toast('Vous êtes déconnecté(e)', { type: 'success' });

        // Déclenche refresh (qui lance le refetch) et recharge la page
        refresh();
        reload();
    }, [socket, refresh]);

    // Fonction pour recharger la page
    const reload = useCallback((): void => {
        navigate(location.pathname + location.search);
    }, [navigate, location]);

    // Debug : Observer l'état isLogged lors de chaque changement
    useEffect(() => {
        console.log('Etat de connexion (isLogged):', authState.isLogged);
    }, [authState.isLogged]);

    const contextValue: AuthContextType = {
        authState,
        setAuthState,
        refresh,
    };

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
