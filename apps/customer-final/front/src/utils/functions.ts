export function isMobile(): boolean {
    const toMatch: RegExp[] = [/Android/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i];
    return toMatch.some((regex: RegExp): boolean => Boolean(navigator.userAgent.match(regex)));
}
