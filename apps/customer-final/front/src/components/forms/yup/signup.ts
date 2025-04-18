// src/forms/yup/signup.ts
import * as yup from 'yup';
import { ObjectSchema } from 'yup';
import { SignUpFormValues } from '../../../types/form';

/**
 * Schéma Yup pour la validation du formulaire d'inscription.
 */
const validationSchema: ObjectSchema<SignUpFormValues> = yup.object().shape({
    email: yup.string().email('Email invalide').required("L'email est requis"),
    password: yup
        .string()
        .min(8, 'Le mot de passe doit faire au moins 8 caractères')
        .matches(/(?=.*[A-Z])/, 'Le mot de passe doit contenir au moins une majuscule')
        .matches(/(?=.*[!@#$%^&*])/, 'Le mot de passe doit contenir au moins un des caractères spéciaux suivants : ! @ # $ % ^ & *')
        .required('Le mot de passe est requis'),
    typeInscription: yup.string().nullable(),
    passwordConfirm: yup
        .string()
        .oneOf([yup.ref('password')], 'Les mots de passe ne correspondent pas')
        .nullable()
        .required('La confirmation du mot de passe est requise'),
    cguConsent: yup.boolean().oneOf([true], 'Vous devez accepter les conditions').required('Vous devez accepter les conditions'),
});

export default validationSchema;
