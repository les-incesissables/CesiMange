// src/services/XsrfHeader.ts

/**
 * Récupère le token XSRF stocké dans le localStorage et le retourne dans un objet d'en-têtes.
 * Si le token n'existe pas, retourne un objet vide.
 */
export function getXsrfHeader(): { [header: string]: string } {
    const xsrfToken = localStorage.getItem('xsrfToken');
    const headers: { [header: string]: string } = {};
    if (xsrfToken) {
        headers['x-xsrf-token'] = xsrfToken;
    }
    return headers;
}
