import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    useEffect(() => {
        if (!isOpen) {
            // Rien à faire si le modal n'est pas ouvert
            return;
        }

        // Ici, vous pouvez gérer le code à exécuter quand le modal s’ouvre

        document.body.style.overflow = 'hidden';

        // Et si besoin, retourner une fonction de nettoyage
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 sm:px-0" onClick={handleBackdropClick}>
            <div className="relative bg-[#E4DBC7] rounded-2xl outline-1 outline-black w-full max-w-md max-h-screen overflow-y-auto p-6 shadow-xl">
                {children}
            </div>
        </div>,
        document.body,
    );
};

export default Modal;
