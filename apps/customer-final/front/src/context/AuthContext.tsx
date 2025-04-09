// src/context/AuthContext.tsx
import { createContext, useState, useCallback, useEffect, ReactNode, Dispatch, SetStateAction, FC } from 'react';
import moment from 'moment';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router';
import { toast } from 'react-toastify';

// Importation de l'instance du local middleware
import { localMiddlewareInstance } from 'customer-final-middleware';

// ----- INTERFACES ----- //

/**
 * Représente un utilisateur.
 */
export interface User {
    id: number;
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
    // Désactive les avertissements de Moment.js
    moment.suppressDeprecationWarnings = true;

    // Hooks de routing
    const navigate = useNavigate();
    const location = useLocation();

    // Vérifie rapidement la présence d'un utilisateur dans le localStorage
    const isUserLogged = (): boolean => !!localStorage.getItem('user');

    // État local d'authentification
    const [authState, setAuthState] = useState<AuthState>({
        me: null,
        isLogged: isUserLogged(),
    });

    // Utilisation de React Query pour récupérer l’utilisateur via le local middleware
    const meQuery: UseQueryResult<User, Error> = useQuery<User, Error>({
        queryKey: ['me'],
        queryFn: async () => {
            // Dans cet exemple, on récupère l’objet "user" depuis le localStorage, puis on appelle une méthode du UserRepo.
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const parsedUser = JSON.parse(userStr);
                // On suppose que l'id est stocké dans parsedUser.id
                const userId = parsedUser.id;
                /*   const result = await localMiddlewareInstance.callLocalApi(async () => {
                    const lUserProfile = { user_id: userId };
                    const res = await localMiddlewareInstance.UserRepo.getItems(lUserProfile);
                    return res;
                }); */
                // On retourne le premier élément du tableau
                return userId;
            }
            return {} as User;
        },
        enabled: typeof window !== 'undefined' ? !window.location.pathname.includes('dashboard/profil') && isUserLogged() : false,
        staleTime: 1000,
    });

    // En cas d'erreur de la query, on nettoie la session
    useEffect(() => {
        if (meQuery.isError) {
            localStorage.removeItem('user');
            localStorage.removeItem('timeSession');
            localStorage.removeItem('xsrfToken');
            setAuthState({ me: null, isLogged: false });
        }
    }, [meQuery.isError]);

    // Fonction de mise à jour de l'état à partir de meQuery
    const setMe = useCallback(() => {
        if (meQuery.isSuccess && meQuery.data && Object.keys(meQuery.data).length) {
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

    // La fonction refresh déclenche un refetch via React Query et retourne l'état actuel (avant mise à jour)
    const refresh = useCallback((): AuthState => {
        console.log('refresh auth context');
        meQuery.refetch();
        return authState;
    }, [meQuery, authState]);

    // Met à jour authState dès que meQuery se résout
    useEffect(() => {
        setMe();
    }, [setMe]);

    // Vérification initiale de la session : si le token est absent ou expiré, déclencher le logout
    useEffect(() => {
        const currentTime = moment();
        const timeSessionStr = localStorage.getItem('timeSession');
        const timeSession = timeSessionStr ? moment(timeSessionStr) : moment().subtract(1, 'minute');
        if (!localStorage.getItem('user') || currentTime.isAfter(timeSession)) {
            logout();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Écoute des modifications dans le localStorage pour détecter la suppression du token CSRF
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

    // Fonction de déconnexion qui appelle logout de localMiddleware
    const logout = useCallback((): void => {
        localMiddlewareInstance
            .callLocalApi(async () => {
                return await localMiddlewareInstance.AuthRepo.logout();
            })
            .then((lResponse) => {
                if (lResponse.status === 'success') {
                    localStorage.removeItem('user');
                    localStorage.removeItem('timeSession');
                    localStorage.removeItem('xsrfToken');
                }
                setAuthState({ ...authState, me: null, isLogged: false });
                // Ici, vous pouvez notifier le serveur via socket si besoin
                // socket.send('userLogout', { id: authState?.me?.id });
                // socket.off('userConnect');
                toast('Vous êtes déconnecté(e)', { type: 'success' });
                refresh();
                reload();
            })
            .catch((error) => {
                console.error('Erreur lors du logout via middleware :', error);
            });
    }, [authState, refresh]);

    // Fonction pour recharger la page
    const reload = useCallback((): void => {
        navigate(location.pathname + location.search);
    }, [navigate, location]);

    // Debug: observer l'état isLogged
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
