import { ReactNode } from 'react';

// Types pour les props
type SizeType = 'sm' | 'md' | 'lg';
type ColorType = 'yellow-400' | 'black' | 'stone-600' | 'white';

interface BusyLoaderProps
{
    size?: SizeType;
    color?: ColorType;
    text?: string;
}

interface BusyOverlayProps
{
    isLoading: boolean;
    children: ReactNode;
    text?: string;
}

// Configuration des tailles
const sizeClasses: Record<SizeType, string> = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
};

// Configuration des couleurs
const borderColors: Record<ColorType, string> = {
    'yellow-400': 'border-yellow-400',
    'black': 'border-black',
    'stone-600': 'border-stone-600',
    'white': 'border-white'
};

const BusyLoader = ({ size = 'md', color = 'yellow-400', text = 'Chargement...' }: BusyLoaderProps) =>
{
    return (
        <div className="flex flex-col items-center justify-center gap-3 p-4">
            <div className={`rounded-full ${sizeClasses[size]} border-t-transparent ${borderColors[color]} animate-spin`}></div>
            {text && (
                <p className="font-bold text-center font-['Inter']">{text}</p>
            )}
        </div>
    );
};

// Composant d'overlay qui affiche le loader sur un fond semi-transparent
export const BusyOverlay = ({ isLoading, children, text = 'Chargement...' }: BusyOverlayProps) =>
{
    if (!isLoading) return <>{children}</>;

    return (
        <div className="relative">
            {children}
            <div className="absolute inset-0 flex items-center justify-center bg-stone-100 bg-opacity-70 z-10">
                <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
                    <BusyLoader size="md" color="yellow-400" text={text} />
                </div>
            </div>
        </div>
    );
};

export { BusyLoader };
export default BusyLoader;