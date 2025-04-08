// src/types/forms.ts

// Interfaces pour les formulaires d'inscription / authentification
export interface SignUpFormValues {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    passwordConfirm?: string | null;
    cguConsent: boolean;
    typeInscription: string;
}

export interface InputsConnexion {
    email: string;
    password: string;
    passwordConfirm?: string | null;
    firstname: string;
    lastname: string;
    typeInscription: string;
}

// Interfaces pour le hook d'authentification
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
    confirm: string;
    firstname: string;
    lastname: string;
    typeInscription: string;
}

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

export interface PasswordStrengthInfo {
    class: string;
    contains: string[];
    length: number;
    allowed: boolean;
}
