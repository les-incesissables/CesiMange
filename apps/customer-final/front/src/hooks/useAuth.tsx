// src/hooks/useAuth.tsx

import { useState, useContext, useEffect } from 'react';

// API
import API from '../api/axios.config';

// LIBS
import { toast } from 'react-toastify';
import moment from 'moment';

// CONTEXTS
import { AuthContext, AuthContextType } from '../context/AuthContext';
import { SocketContext, ISocketContext } from '../context/SocketContext';
import { useLocation, useNavigate } from 'react-router';
// --- Interfaces pour les entrées des différentes actions ---

export interface LoginInput {
    email: string;
    password: string;
}

export interface ForgotPasswordInput {
    email: string;
}

export interface SignUpInput {
    email: string;
    password: string;
    passwordConfirm?: string | null;
    firstname: string;
    lastname: string;
    typeInscription: string;
}

// Interface décrivant les valeurs retournées par le hook.
export interface UseAuthReturn {
    isSubmitted: boolean;
    isForgotSubmitted: boolean;
    isSignupSubmitted: boolean;
    hasError: boolean;
    errorMsg: string;
    logout: () => void;
    login: (inputsConnexion: LoginInput) => Promise<boolean | void>;
    loginByOauth: (tokenId: string, type: string) => Promise<void>;
    forgotPassword: (inputsConnexion: ForgotPasswordInput) => Promise<boolean | void>;
    signUp: (inputsConnexion: SignUpInput) => Promise<boolean | void>;
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
    const [authState, setAuthState, refresh] = useContext<AuthContextType>(AuthContext);
    const socket = useContext<ISocketContext>(SocketContext);

    // HOOKS ROUTING
    const navigate = useNavigate();
    const location = useLocation();

    // Vérification au montage : si la session est expirée, on se déconnecte.
    useEffect(() => {
        const currentTime = moment();
        const timeSessionStr = localStorage.getItem('timeSession');
        const timeSession = timeSessionStr ? moment(timeSessionStr) : moment().subtract(1, 'minute');

        if (localStorage.getItem('user') && (currentTime.isAfter(timeSession, 'minute') || !timeSessionStr)) {
            logout();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fonction de connexion via email et mot de passe.
    const login = async (inputsConnexion: LoginInput): Promise<boolean | void> => {
        console.log('login dans useAuth');
        try {
            const mailformat = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
            if (!inputsConnexion.email.match(mailformat)) {
                console.log('ya une erreur');
                setHasError(true);
                setIsSubmitted(true);
                return false;
            } else {
                setHasError(false);
            }
            const response = await API.post('users/login', {
                email: inputsConnexion.email,
                password: inputsConnexion.password,
            });
            if (response.status === 200) {
                setConnexion(response);
            }
        } catch (err) {
            setIsSubmitted(true);
            setHasError(true);
        }
    };

    // Connexion via OAuth
    const loginByOauth = async (tokenId: string, type: string): Promise<void> => {
        const response = await API.post('users/loginByOauth', { tokenId, type });
        if (response.status === 200) {
            setIsSubmitted(true);
            setHasError(false);
            setConnexion(response);
        }
    };

    // Stocke les informations de connexion en cas de succès
    const setConnexion = (response: any): void => {
        if (response.data.error) {
            setIsSubmitted(true);
        } else {
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
                // On convertit la date en chaîne pour le stockage
                localStorage.setItem('timeSession', moment().add(150, 'days').toString());
            }
            /*  if (!isMobile()) {
        toast('Vous êtes connecté(e)', { type: 'success' });
      } */
            setIsSubmitted(true);
            setHasError(false);
            refresh();
        }
    };

    // Demande de réinitialisation du mot de passe
    const forgotPassword = async (inputsConnexion: ForgotPasswordInput): Promise<boolean | void> => {
        try {
            const response = await API.post('users/forgotPassword', {
                email: inputsConnexion.email,
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
    const signUp = async (inputsConnexion: SignUpInput): Promise<boolean | void> => {
        try {
            setIsSignupSubmitted(true);
            const response = await API.post('users/signup', {
                email: inputsConnexion.email,
                password: inputsConnexion.password,
                passwordConfirm: inputsConnexion.passwordConfirm,
                firstname: inputsConnexion.firstname,
                lastname: inputsConnexion.lastname,
                typeInscription: inputsConnexion.typeInscription,
            });
            if (response.status === 201) {
                /*  if (!isMobile()) {
          toast('Vous avez créé un compte SkillsMarket !', { type: 'success' });
        } */
                await login(inputsConnexion);
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
        localStorage.removeItem('user');
        localStorage.removeItem('timeSession');

        setAuthState({
            ...authState,
            me: null,
            isLogged: false,
        });

        // On envoie le message de déconnexion via le socket.
        socket.send('userLogout', { id: authState?.me?.id });
        socket.off('userConnect');
        toast('Vous êtes déconnecté(e)', { type: 'success' });

        refresh();
        reload();
    };

    // Recharge la page en naviguant sur l'URL actuelle.
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
