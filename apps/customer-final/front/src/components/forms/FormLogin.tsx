// src/components/forms/FormLogin.tsx
import { useState, useImperativeHandle, forwardRef, useContext, useEffect, useCallback, useRef, ChangeEvent, MouseEvent } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { passwordStrength } from 'check-password-strength';

// HOOKS
import UseAuth from '../../hooks/useAuth';

// FORMS : le schéma de validation et l'interface importée du dossier types
import validationSchema from './yup/signup';
import { SignUpFormValues } from '../../types/form';

// CONTEXTS
import { AuthContext } from '../../context/AuthContext';

// COMPONENTS
import { Link } from 'react-router';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

// Importer également les autres interfaces centralisées si nécessaire
import { InputsConnexion, PasswordStrengthInfo } from '../../types/form';
import Alert from '../Alert';

//
// Types pour les props et le ref exposé par le composant
//

interface FormConnexionProps {
    modalConfirmLabel: (label: string) => void;
    isLogged: (value: boolean) => void;
    onLogged: () => void;
}

export interface FormConnexionHandle {
    login: () => void;
    openSignup: () => void;
}

//
// Composant
//

const FormLogin = forwardRef<FormConnexionHandle, FormConnexionProps>((props, ref) => {
    // CONTEXTES
    const [authState] = useContext(AuthContext);

    // HOOKS d'authentification custom
    const { isSubmitted, isForgotSubmitted, isSignupSubmitted, hasError, errorMsg, login, forgotPassword, signUp } = UseAuth();

    // STATE pour le formulaire de connexion (login / mot de passe oublié)
    const [inputsConnexion, setInputsConnexion] = useState<InputsConnexion>({
        email: '',
        password: '',
        passwordConfirm: '',
        firstname: '',
        lastname: '',
        typeInscription: '',
    });
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isForgot, setIsForgot] = useState<boolean>(false);
    const [isSignup, setIsSignup] = useState<boolean>(false);
    const [strongPwd, setStrongPwd] = useState<PasswordStrengthInfo | null>(null);
    const [typeInscription, setTypeInscription] = useState<string | null>(null);

    // Réf pour le bouton Google, par exemple
    const ggRef = useRef<HTMLDivElement>(null);

    // Utilisation de react-hook-form avec l'interface SignUpFormValues et le schéma Yup
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        getValues,
    } = useForm<SignUpFormValues>({
        resolver: yupResolver(validationSchema),
    });

    useEffect(() => {
        console.log(errors);
    }, [errors]);

    // Modification du label du bouton modal selon le mode (connexion, mot de passe oublié, ou inscription)
    useEffect(() => {
        if (isSignup) {
            props.modalConfirmLabel("S'inscrire");
        } else if (isForgot) {
            props.modalConfirmLabel('Réinitialiser');
        } else {
            props.modalConfirmLabel('Se connecter');
        }
    }, [isSignup, isForgot]);

    useEffect(() => {
        if (isSubmitted && authState.isLogged) {
            props.isLogged(true);
        }
    }, [isSubmitted]);

    const onSubmitCallback = useCallback(() => {
        if (isSubmitted && authState.isLogged) {
            props.onLogged();
        }
    }, [authState.isLogged, props, isSubmitted]);

    useEffect(() => {
        onSubmitCallback();
    }, [onSubmitCallback]);

    // Gestion de la soumission pour l'inscription via react-hook-form
    const onSubmitSignUp: SubmitHandler<SignUpFormValues> = (data) => {
        if (strongPwd?.allowed === true) {
            signUp(data);
        }
    };

    // Gestion des changements dans le formulaire de connexion
    function handleChangeFormConnexion(e: ChangeEvent<HTMLInputElement>): void {
        setInputsConnexion({
            ...inputsConnexion,
            [e.target.name]: e.target.value,
        });
    }

    // Basculement de la visibilité du mot de passe
    function handleShowPassword(e: MouseEvent<HTMLButtonElement>): void {
        e.preventDefault();
        e.stopPropagation();
        setShowPassword(!showPassword);
    }

    // Exposition des méthodes vers le parent via ref
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

    // Suivi de la force du mot de passe (pour afficher éventuellement une barre de progression)
    useEffect(() => {
        const sPwd = getValues('password');
        const strength = passwordStrength(sPwd);
        switch (strength.value) {
            default:
                setStrongPwd(null);
                break;
            case 'Too weak':
                setStrongPwd({
                    class: 'bg-red w-1/4',
                    contains: strength.contains,
                    length: strength.length,
                    allowed: true,
                });
                break;
            case 'Weak':
                setStrongPwd({
                    class: 'bg-warning-500 w-2/4',
                    contains: strength.contains,
                    length: strength.length,
                    allowed: true,
                });
                break;
            case 'Medium':
                setStrongPwd({
                    class: 'bg-warning-500 w-3/4',
                    contains: strength.contains,
                    length: strength.length,
                    allowed: true,
                });
                break;
            case 'Strong':
                setStrongPwd({
                    class: 'bg-success-500 w-full',
                    contains: strength.contains,
                    length: strength.length,
                    allowed: true,
                });
                break;
        }
        if (strength.length <= 0) setStrongPwd(null);
    }, [watch('password')]);

    return (
        <>
            {/* === Formulaire de connexion === */}
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

            {/* === Formulaire "Mot de passe oublié" === */}
            {isForgot && (
                <>
                    <h1 className="-mx-2 md:-mx-8 -mt-8 text-lg text-mainText font-bold px-2 md:px-8 py-4 border-b border-gray-200">Mot de passe oublié</h1>
                    {/* {hasError && isForgotSubmitted && !authState.isLogged && <Alert type="danger" message={errorMsg} />} */}
                    {isForgotSubmitted && !hasError && !authState.isLogged && (
                        <div>test</div>
                        // <Alert type="success" message="Un email de réinitialisation vous a été envoyé. N'oubliez pas de vérifier vos spams si besoin." />
                    )}
                    <form className="mt-8 m-0" autoComplete="off">
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

            {/* === Formulaire d'inscription === */}
            {isSignup && (
                <>
                    <h1 className="-mx-2 md:-mx-8 -mt-8 text-lg text-mainText font-bold px-2 md:px-8 py-4 border-b border-gray-200">Inscription à CesiMange</h1>
                    {isSignupSubmitted && authState.isLogged && <Alert type="success" message="Vous avez créé un compte !" />}
                    {hasError && isSignupSubmitted && !authState.isLogged && <Alert type="danger" message="Un compte existe déjà avec cette adresse email" />} *
                    <form className="m-0 min-w-lg" autoComplete="off">
                        <div className="w-full mt-2 mb-6">
                            <label className="text-sm">Inscription en tant que :</label>
                            {/* Exemple d'utilisation d'un sélecteur personnalisé
                                <FieldSelect
                                inputForm="rounded"
                                name="typeInscription"
                                label={false}
                                options={[
                                    { label: 'Personne', value: 'realnames' },
                                    { label: 'Société', value: 'society' },
                                ]}
                                onChange={(e: ChangeEvent<HTMLSelectElement>) => setTypeInscription(e.target.value)}
                                register={register}
                                errors={errors}
                                /> */}
                        </div>
                        <div className="flex w-full gap-3">
                            <div className="w-1/2 relative z-0 mb-2 group">
                                <input className="input_floating peer" placeholder=" " type="text" {...register('firstname')} />
                                <label htmlFor="floating_firstname" className="input_labelFloating">
                                    Prénom*
                                </label>
                                {errors.firstname && <span className="mt-0 text-sm text-danger-400">{errors.firstname.message}</span>}
                            </div>
                            <div className="w-1/2 relative z-0 mb-2 group">
                                <input className="input_floating peer" placeholder=" " type="text" {...register('lastname')} />
                                <label htmlFor="floating_lastname" className="input_labelFloating">
                                    Nom*
                                </label>
                                {errors.lastname && <span className="mt-0 text-sm text-danger-400">{errors.lastname.message}</span>}
                            </div>
                        </div>
                        <div className="relative z-0 w-full mb-2 group">
                            <input className="input_floating peer" placeholder=" " type="text" {...register('email')} />
                            <label htmlFor="floating_email" className="input_labelFloating">
                                Adresse email*
                            </label>
                            {errors.email && <span className="mt-0 text-sm text-danger-400">{errors.email.message}</span>}
                        </div>
                        <div className="relative z-0 w-full mb-6 groupMdp">
                            <input
                                className="input_floating peer text-black"
                                placeholder=" "
                                type={showPassword ? 'text' : 'password'}
                                {...register('password')}
                                autoComplete="off"
                            />
                            <label htmlFor="floating_password" className="input_labelFloating">
                                Mot de passe
                            </label>
                            <button className="absolute right-0 top-0 mt-2 mr-2" onClick={handleShowPassword}>
                                {showPassword ? <EyeIcon className="h-6 w-6 block text-black" /> : <EyeSlashIcon className="h-6 w-6 block text-black" />}
                            </button>
                            <div className={`${strongPwd?.class} h-[2px] block absolute bottom-0`}></div>
                            {errors.password && <span className="w-full mt-0 text-xs text-danger-400">{errors.password.message}</span>}
                        </div>
                        <div className="flex flex-col">
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
                            {errors.cguConsent && <span className="w-full mt-0 text-sm text-danger-400">{errors.cguConsent.message}</span>}
                        </div>
                    </form>
                    <p className="text-purpleSkills text-xl font-bold text-center mt-4">Ou</p>
                    <div className="m-auto mt-4 text-center flex justify-center">
                        <div ref={ggRef}></div>
                    </div>
                </>
            )}
        </>
    );
});

export default FormLogin;
