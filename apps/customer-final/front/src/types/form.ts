// src/types/forms.ts

// Interfaces pour les formulaires d'inscription / authentification
export interface SignUpFormValues {
    email: string;
    password: string;
    passwordConfirm: string;
    cguConsent: boolean;
    typeInscription?: string | null;
}

export interface InputsConnexion {
    email: string;
    password: string;
    passwordConfirm?: string | null;
    typeInscription?: string | null;
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
    passwordConfirm: string;
    typeInscription?: string | null;
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

export interface ForgotPasswordInput {
    email: string;
}
