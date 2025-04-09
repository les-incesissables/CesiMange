// src/hooks/useAuth.tsx
import { useState, useContext, useEffect } from 'react';
import API from '../api/axios.config';
import { toast } from 'react-toastify';
import moment from 'moment';
import { useLocation, useNavigate } from 'react-router';

// CONTEXTS
import { AuthContext, AuthContextType } from '../context/AuthContext';
import { SocketContext, ISocketContext } from '../context/SocketContext';

import { localMiddlewareInstance } from 'customer-final-middleware';
import { ForgotPasswordInput, LoginInput, SignUpInput } from '../types/form';

// Interface retournée par le hook
export interface UseAuthReturn {
    isSubmitted: boolean;
    isForgotSubmitted: boolean;
    isSignupSubmitted: boolean;
    hasError: boolean;
    errorMsg: string;
    logout: () => void;
    login: (inputs: LoginInput) => Promise<boolean | void>;
    loginByOauth: (tokenId: string, type: string) => Promise<void>;
    forgotPassword: (inputs: ForgotPasswordInput) => Promise<boolean | void>;
    signUp: (inputs: SignUpInput) => Promise<boolean | void>;
    reload: () => void;
}

const useAuth = (): UseAuthReturn => {
    // États locaux
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [isForgotSubmitted, setIsForgotSubmitted] = useState<boolean>(false);
    const [isSignupSubmitted, setIsSignupSubmitted] = useState<boolean>(false);
    const [hasError, setHasError] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>('');

    // CONTEXTS
    const { authState, setAuthState, refresh } = useContext<AuthContextType>(AuthContext);
    const socket = useContext<ISocketContext>(SocketContext);

    // HOOKS ROUTING
    const navigate = useNavigate();
    const location = useLocation();

    // Vérifie le token CSRF et déclenche logout si absent
    const checkXsrfToken = (): boolean => {
        const xsrfToken = localStorage.getItem('xsrfToken');
        if (!xsrfToken) {
            console.warn('Token CSRF manquant, déclenchement du logout.');
            logout();
            return false;
        }
        return true;
    };

    // Vérification initiale de la session : si le token ou la session est expiré, déconnecte
    useEffect(() => {
        const currentTime = moment();
        const timeSessionStr = localStorage.getItem('timeSession');
        const timeSession = timeSessionStr ? moment(timeSessionStr) : moment().subtract(1, 'minute');
        if (!localStorage.getItem('user') || currentTime.isAfter(timeSession)) {
            logout();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fonction de connexion via email/mot de passe
    const login = async (inputs: LoginInput): Promise<boolean | void> => {
        console.log('login dans useAuth');
        try {
            const mailformat = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
            if (!inputs.email.match(mailformat)) {
                console.log('Erreur de format email');
                setHasError(true);
                setIsSubmitted(true);
                return false;
            } else {
                setHasError(false);
            }

            let lCritere = {
                email: inputs.email,
                password_hash: inputs.password,
            };

            const lResponse = await localMiddlewareInstance.callLocalApi(async () => {
                return await localMiddlewareInstance.AuthRepo.login(lCritere);
            });

            console.log('Réponse de connexion:', lResponse);
            if (lResponse.status === 'success') {
                setConnexion(lResponse);
            }
        } catch (err) {
            setIsSubmitted(true);
            setHasError(true);
        }
    };

    // Connexion via OAuth
    const loginByOauth = async (tokenId: string, type: string): Promise<void> => {
        const response = await API.post('auth/loginByOauth', { tokenId, type });
        if (response.status === 200) {
            setIsSubmitted(true);
            setHasError(false);
            setConnexion(response);
        }
    };

    // Stocke la connexion suite à une réponse réussie, met à jour immédiatement authState
    const setConnexion = (response: any): void => {
        if (response.data.error) {
            setIsSubmitted(true);
        } else {
            if (response.data.xsrfToken) {
                localStorage.setItem('user', JSON.stringify(response.data));
                localStorage.setItem('xsrfToken', JSON.stringify(response.data.xsrfToken));
                // Définir la validité de la session pour 1 jour
                localStorage.setItem('timeSession', moment().add(1, 'days').toString());
            }
            console.log('Réponse de connexion:', response.data);
            setIsSubmitted(true);
            setHasError(false);
            // Mise à jour immédiate de l'état d'authentification
            setAuthState(() => ({ me: response.data, isLogged: true }));
            // Vérifie que le token est présent et appelle refresh
            if (checkXsrfToken()) {
                refresh();
            }
        }
    };

    // Demande de réinitialisation du mot de passe
    const forgotPassword = async (inputs: ForgotPasswordInput): Promise<boolean | void> => {
        try {
            const response = await API.post('users/forgotPassword', {
                email: inputs.email,
            });
            if (response.status === 200) {
                toast('Un email de réinitialisation vous a été envoyé', { type: 'success' });
                setIsForgotSubmitted(true);
                setHasError(false);
                return true;
            } else if (response.status === 201) {
                setHasError(true);
                setErrorMsg('Un mail vous a déjà été envoyé il y a moins de 1 heure');
                setIsForgotSubmitted(true);
            }
        } catch (err) {
            setHasError(true);
            setErrorMsg("Aucun compte n'existe avec cette adresse email");
            setIsForgotSubmitted(true);
        }
    };

    // Création d'un compte
    const signUp = async (inputs: SignUpInput): Promise<boolean | void> => {
        try {
            setIsSignupSubmitted(true);
            //if (!pAuthUsers.email || !pAuthUsers.password_hash || !pAuthUsers.username)
            console.log('signup');
            const response = await localMiddlewareInstance.callLocalApi(async () => {
                // Ici, on pourrait appeler une méthode register sur AuthRepo via le middleware.
                return await localMiddlewareInstance.AuthRepo.register({
                    email: inputs.email,
                    password_hash: inputs.password,
                    passwordConfirm: inputs.passwordConfirm,
                });
            });
            if (response.status === 'success') {
                await login(inputs);
                return true;
            } else {
                toast('Une erreur est survenue', { type: 'error' });
                return false;
            }
        } catch (err) {
            console.error(err);
            toast('Un compte existe déjà avec cette adresse email', { type: 'error' });
            setHasError(true);
            setIsSignupSubmitted(false);
        }
    };

    // Déconnexion
    const logout = (): void => {
        localMiddlewareInstance
            .callLocalApi(async () => {
                return await localMiddlewareInstance.AuthRepo.logout();
            })
            .then((lResponse) => {
                if (lResponse.status === 'success') {
                    // Supprimez les éléments de session
                    localStorage.removeItem('user');
                    localStorage.removeItem('timeSession');
                    localStorage.removeItem('xsrfToken');
                }
                // Mettez à jour l'état d'authentification
                setAuthState({ ...authState, me: null, isLogged: false });
                // Notifiez le serveur via le socket
                if (authState.me?.id) {
                    socket.send('userLogout', { id: authState.me.id });
                }
                socket.off('userConnect');
                toast('Vous êtes déconnecté(e)', { type: 'success' });
                refresh();
                reload();
            })
            .catch((error) => {
                console.error('Erreur lors du logout via middleware :', error);
            });
    };

    // Recharge la page
    const reload = (): void => {
        navigate(location.pathname + location.search);
    };

    return {
        isSubmitted,
        isForgotSubmitted,
        isSignupSubmitted,
        hasError,
        errorMsg,
        logout,
        login,
        loginByOauth,
        forgotPassword,
        signUp,
        reload,
    };
};

export default useAuth;
