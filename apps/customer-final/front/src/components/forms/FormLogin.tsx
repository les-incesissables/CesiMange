// src/components/forms/FormLogin.tsx
import { useState, useImperativeHandle, forwardRef, useContext, useEffect, useCallback, useRef, ChangeEvent, MouseEvent } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { passwordStrength } from 'check-password-strength';

// HOOKS
import UseAuth from '../../hooks/useAuth';

// FORMS : schéma de validation et interface pour l'inscription (utilisée par react-hook-form)
import validationSchema from './yup/signup';
import { SignUpFormValues } from '../../types/form';

// CONTEXTES
import { AuthContext } from '../../context/AuthContext';

// COMPONENTS
import { Link } from 'react-router';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Alert from '../Alert';

// Interfaces supplémentaires importées depuis vos types centralisés
import { InputsConnexion, PasswordStrengthInfo as PSInfo } from '../../types/form';

// ----- TYPES DU COMPOSANT -----
interface FormConnexionProps {
    modalConfirmLabel: (label: string) => void;
    isLogged: (value: boolean) => void;
    onLogged: () => void;
}

export interface FormConnexionHandle {
    login: () => void;
    openSignup: () => void;
}

// ----- COMPOSANT -----
const FormLogin = forwardRef<FormConnexionHandle, FormConnexionProps>((props, ref) => {
    // Contexte d'authentification (pour récupérer authState, etc.)
    const { authState } = useContext(AuthContext);

    // Extraction des méthodes d'authentification via votre hook useAuth
    const { isSubmitted, isForgotSubmitted, isSignupSubmitted, hasError, errorMsg, login, forgotPassword, signUp } = UseAuth();

    // État local pour la gestion des données de connexion
    const [inputsConnexion, setInputsConnexion] = useState<InputsConnexion>({
        email: '',
        password: '',
        passwordConfirm: '',
        firstname: '',
        lastname: '',
        typeInscription: 'customer',
    });
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isForgot, setIsForgot] = useState<boolean>(false);
    const [isSignup, setIsSignup] = useState<boolean>(false);
    const [strongPwd, setStrongPwd] = useState<PSInfo | null>(null);
    const [typeInscription, setTypeInscription] = useState<string | null>(null);

    // Référence pour le bouton Google (si besoin)
    const ggRef = useRef<HTMLDivElement>(null);

    // Utilisation de react-hook-form pour le formulaire d'inscription,
    // en se basant sur l'interface SignUpFormValues et validé par Yup.
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        getValues,
    } = useForm<SignUpFormValues>({
        resolver: yupResolver(validationSchema),
    });

    // DEBUG : Affiche les erreurs de validation dans la console (pour le dev)
    useEffect(() => {
        console.log('Form errors:', errors);
    }, [errors]);

    // Mise à jour du label du bouton modal en fonction du mode du formulaire
    useEffect(() => {
        if (isSignup) {
            props.modalConfirmLabel("S'inscrire");
        } else if (isForgot) {
            props.modalConfirmLabel('Réinitialiser');
        } else {
            props.modalConfirmLabel('Se connecter');
        }
    }, [isSignup, isForgot, props]);

    // Notifier le parent dès que l'état "isSubmitted" et "authState.isLogged" sont vrais
    useEffect(() => {
        console.log('isSubmitted', isSubmitted);
        console.log('authState.isLogged', authState.isLogged);
        if (isSubmitted && authState.isLogged) {
            props.isLogged(true);
        }
    }, [isSubmitted]);

    // Callback pour déclencher l'action "onLogged" dans le parent
    const onSubmitCallback = useCallback(() => {
        if (isSubmitted && authState.isLogged) {
            props.onLogged();
        }
    }, [isSubmitted, authState.isLogged, props]);

    useEffect(() => {
        console.log(authState.isLogged);
    }, [authState]);

    useEffect(() => {
        onSubmitCallback();
    }, [onSubmitCallback]);

    // Gestion de la soumission pour l'inscription via react-hook-form
    const onSubmitSignUp: SubmitHandler<SignUpFormValues> = (data) => {
        if (strongPwd?.allowed === true) {
            signUp(data);
        }
    };

    // Gestion de la modification des champs dans le formulaire de connexion (mode login/forgot)
    const handleChangeFormConnexion = (e: ChangeEvent<HTMLInputElement>): void => {
        setInputsConnexion((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // Basculement de la visibilité du mot de passe
    const handleShowPassword = (e: MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        setShowPassword((prev) => !prev);
    };

    // Expose les méthodes "login" et "openSignup" au parent via ref
    useImperativeHandle(ref, () => ({
        login: () => {
            if (!isForgot && !isSignup) {
                console.log('useImperative login');
                login(inputsConnexion);
            } else if (isForgot) {
                forgotPassword(inputsConnexion);
            } else if (isSignup && !isSignupSubmitted) {
                handleSubmit(onSubmitSignUp)();
            }
        },
        openSignup: () => {
            setIsSignup(true);
        },
    }));

    // Suivi de la force du mot de passe
    useEffect(() => {
        const sPwd = getValues('password');
        const strength = passwordStrength(sPwd);
        switch (strength.value) {
            case 'Too weak':
                setStrongPwd({ class: 'bg-red w-1/4', contains: strength.contains, length: strength.length, allowed: true });
                break;
            case 'Weak':
                setStrongPwd({ class: 'bg-warning-500 w-2/4', contains: strength.contains, length: strength.length, allowed: true });
                break;
            case 'Medium':
                setStrongPwd({ class: 'bg-warning-500 w-3/4', contains: strength.contains, length: strength.length, allowed: true });
                break;
            case 'Strong':
                setStrongPwd({ class: 'bg-success-500 w-full', contains: strength.contains, length: strength.length, allowed: true });
                break;
            default:
                setStrongPwd(null);
        }
        if (strength.length <= 0) setStrongPwd(null);
    }, [watch('password'), getValues]);

    // Rendu du composant
    return (
        <>
            {/* ***** Mode Connexion ***** */}
            {!isForgot && !isSignup && !authState.isLogged && (
                <>
                    <h1 className="-mx-6 -mt-6 text-3xl text-black text-center font-bold px-2 md:px-8 py-4 border-b border-black">Connexion</h1>
                    {hasError && isSubmitted && !authState.isLogged && (
                        <Alert type="danger" message="Mot de passe ou identifiant incorrect, vous pouvez réinitialiser votre mot de passe." />
                    )}
                    <form className="mt-2 m-0" autoComplete="off">
                        <div className="relative z-0 w-full mb-2 group flex flex-col gap-1">
                            <label className="">Adresse email* :</label>
                            <input
                                type="text"
                                name="email"
                                value={inputsConnexion.email}
                                onChange={handleChangeFormConnexion}
                                className="w-full rounded-full border-2 border-gray-300 bg-white py-2 px-6 pr-14 text-lg outline-1 outline-black focus:outline-none focus:border-blue-500"
                                placeholder=" "
                                required
                            />
                        </div>
                        <div className="relative z-0 w-full mb-2 group flex flex-col gap-1">
                            <label className="block text-black">Mot de passe* :</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={inputsConnexion.password}
                                    onChange={handleChangeFormConnexion}
                                    className="w-full rounded-full border-2 border-gray-300 bg-white py-2 px-6 pr-14 text-lg outline-1 outline-black focus:outline-none focus:border-blue-500"
                                    placeholder="Votre mot de passe"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                                    onClick={handleShowPassword}
                                >
                                    {showPassword ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>
                    </form>
                    <p className="mt-4 text-blueMain text-sm text-left md:text-center flex flex-col md:flex-row gap-4">
                        <button onClick={() => setIsForgot(true)}>Mot de passe oublié ?</button>
                        <button className="text-xl font-bold" onClick={() => setIsSignup(true)}>
                            S'inscrire
                        </button>
                    </p>
                    <div className="m-auto mt-8 text-center flex justify-center">
                        <div ref={ggRef}></div>
                    </div>
                </>
            )}

            {/* ***** Mode Mot de passe oublié ***** */}
            {isForgot && (
                <>
                    <h1 className="-mx-2 md:-mx-8 -mt-8 text-lg text-mainText font-bold px-2 md:px-8 py-4 border-b border-gray-200">Mot de passe oublié</h1>
                    {isForgotSubmitted && !hasError && !authState.isLogged && (
                        <div>test</div>
                        // <Alert type="success" message="Un email de réinitialisation vous a été envoyé. Vérifiez vos spams." />
                    )}
                    <form className="mt-2 m-0" autoComplete="off">
                        <div className="relative z-0 w-full mb-6 group">
                            <input
                                className="input_floating peer"
                                placeholder=" "
                                type="text"
                                name="email"
                                value={inputsConnexion.email}
                                onChange={handleChangeFormConnexion}
                            />
                            <label htmlFor="floating_email" className="input_labelFloating">
                                Adresse email
                            </label>
                        </div>
                    </form>
                    <p className="mt-4 text-blueMain text-sm text-center flex gap-4">
                        <button onClick={() => setIsForgot(false)}>Me connecter</button>
                        <button
                            onClick={() => {
                                setIsSignup(true);
                                setIsForgot(false);
                            }}
                        >
                            S'inscrire !
                        </button>
                    </p>
                </>
            )}

            {/* ***** Mode Inscription ***** */}
            {isSignup && (
                <>
                    <h1 className="-mx-6 -mt-6 text-3xl text-black text-center font-bold px-2 md:px-8 py-4 border-b border-black">Inscription</h1>
                    {isSignupSubmitted && authState.isLogged && <Alert type="success" message="Vous avez créé un compte !" />}
                    {hasError && isSignupSubmitted && !authState.isLogged && <Alert type="danger" message="Un compte existe déjà avec cette adresse email" />}
                    <form className="mt-2 m-0" autoComplete="off">
                        <div className="w-full mt-2 mb-6">
                            <label className="text-sm">Inscription en tant que :</label>
                            {/* Ici vous pouvez insérer un sélecteur personnalisé */}
                        </div>
                        <div className="flex w-full flex-col">
                            <div className="relative z-0 w-full mb-2 group flex flex-col gap-1">
                                <label className="">Prénom*</label>
                                <input
                                    className="w-full rounded-full border-2 border-gray-300 bg-white py-2 px-6 pr-14 text-lg outline-1 outline-black focus:outline-none focus:border-blue-500"
                                    placeholder=" "
                                    type="text"
                                    {...register('firstname')}
                                />
                                {errors.firstname && <span className="mt-0 text-sm text-danger">{errors.firstname.message}</span>}
                            </div>
                            <div className="relative z-0 w-full mb-2 group flex flex-col gap-1">
                                <label className="">Nom*</label>
                                <input
                                    className="w-full rounded-full border-2 border-gray-300 bg-white py-2 px-6 pr-14 text-lg outline-1 outline-black focus:outline-none focus:border-blue-500"
                                    placeholder=" "
                                    type="text"
                                    {...register('lastname')}
                                />
                                {errors.lastname && <span className="mt-0 text-sm text-danger">{errors.lastname.message}</span>}
                            </div>
                        </div>
                        <div className="relative z-0 w-full mb-2 group">
                            <label htmlFor="floating_email" className="input_labelFloating">
                                Adresse email*
                            </label>
                            <input
                                className="w-full rounded-full border-2 border-gray-300 bg-white py-2 px-6 pr-14 text-lg outline-1 outline-black focus:outline-none focus:border-blue-500"
                                placeholder=" "
                                type="text"
                                {...register('email')}
                            />

                            {errors.email && <span className="mt-0 text-sm text-danger">{errors.email.message}</span>}
                        </div>

                        <div className="relative z-0 w-full mb-2 group flex flex-col gap-1">
                            <label className="block text-black">Mot de passe* :</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password')}
                                    autoComplete="off"
                                    className="w-full rounded-full border-2 border-gray-300 bg-white py-2 px-6 pr-14 text-lg outline-1 outline-black focus:outline-none focus:border-blue-500"
                                    placeholder="Votre mot de passe"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                                    onClick={handleShowPassword}
                                >
                                    {showPassword ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
                                </button>
                                <div className={`${strongPwd?.class} h-[2px] block absolute bottom-0`}></div>
                                {errors.password && <span className="w-full mt-0 text-xs text-danger">{errors.password.message}</span>}
                            </div>
                        </div>

                        <div className="relative z-0 w-full mb-2 group flex flex-col gap-1">
                            <label className="block text-black">Confirmation du Mot de passe* :</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('passwordConfirm')}
                                    autoComplete="off"
                                    className="w-full rounded-full border-2 border-gray-300 bg-white py-2 px-6 pr-14 text-lg outline-1 outline-black focus:outline-none focus:border-blue-500"
                                    placeholder="Votre mot de passe"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                                    onClick={handleShowPassword}
                                >
                                    {showPassword ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
                                </button>
                                {errors.passwordConfirm && <span className="w-full mt-0 text-xs text-danger">{errors.passwordConfirm.message}</span>}
                            </div>
                        </div>

                        <div className="flex flex-col mt-4">
                            <div className="flex gap-2">
                                <input type="checkbox" id="cguConsent" className="w-10 sm:w-6 mr-4" {...register('cguConsent')} />
                                <label className="text-sm" htmlFor="cgu_consent">
                                    J'ai lu et je consens à la{' '}
                                    <Link className="text-blueMain" to="/cgu" title="Consulter notre politique de confidentialité">
                                        politique de confidentialité
                                    </Link>{' '}
                                    et aux{' '}
                                    <Link className="text-blueMain" to="/cgu" title="Consulter nos conditions d'utilisation">
                                        conditions d'utilisation
                                    </Link>
                                    .
                                </label>
                            </div>
                            {errors.cguConsent && <span className="w-full mt-0 text-sm text-danger">{errors.cguConsent.message}</span>}
                        </div>
                    </form>
                    {/*  <p className="text-purpleSkills text-xl font-bold text-center mt-4">Ou</p>
                    <div className="m-auto mt-4 text-center flex justify-center">
                        <div ref={ggRef}></div>
                    </div> */}
                </>
            )}
        </>
    );
});

export default FormLogin;
