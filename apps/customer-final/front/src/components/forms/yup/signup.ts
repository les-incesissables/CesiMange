// src/forms/yup/signup.ts
import * as yup from 'yup';
import { ObjectSchema } from 'yup';
import { SignUpFormValues } from '../../../types/form';

/**
 * Schéma Yup pour la validation du formulaire d'inscription.
 */
const validationSchema: ObjectSchema<SignUpFormValues> = yup.object().shape({
    firstname: yup.string().nullable().required('Le prénom est requis'),
    lastname: yup.string().nullable().required('Le nom est requis'),
    email: yup.string().email('Email invalide').required("L'email est requis"),
    password: yup.string().min(8, 'Le mot de passe doit faire au moins 8 caractères').required('Le mot de passe est requis'),
    typeInscription: yup.string().required("Le type d'inscription est requis"),
    passwordConfirm: yup
        .string()
        .oneOf([yup.ref('password')], 'Les mots de passe ne correspondent pas')
        .nullable()
        .required('La confirmation du mot de passe est requise'),
    cguConsent: yup.boolean().oneOf([true], 'Vous devez accepter les conditions').required('Vous devez accepter les conditions'),
});

export default validationSchema;
