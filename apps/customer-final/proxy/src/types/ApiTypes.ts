// src/types/ApiTypes.ts

// Par exemple, types spécifiques pour la configuration Axios ou des réponses personnalisées
export type ApiResponse<T> = {
    data: T;
    status: number;
    // Autres champs si nécessaire
};
