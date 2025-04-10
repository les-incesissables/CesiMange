// src/components/Utils/Modal.tsx
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

// Définition de l'interface pour la prop onConfirm
export interface ModalConfirm {
    label: string;
    class?: string;
    disabled?: boolean;
    onClick: () => void;
}

interface ModalProps {
    isOpen: boolean;
    title?: string | null;
    onClose: () => void;
    children: React.ReactNode;
    onConfirm?: ModalConfirm | false;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, onConfirm }) => {
    useEffect(() => {
        if (!isOpen) return;

        // Bloquer le scroll
        document.body.style.overflow = 'hidden';

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
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 px-4 sm:px-0 " onClick={handleBackdropClick}>
            <div className="relative bg-[#E4DBC7] rounded-2xl outline-1 outline-black w-full max-w-md max-h-screen overflow-y-auto p-6 shadow-xl">
                {title && (
                    <div className="mb-4">
                        <h2 className="text-xl font-bold">{title}</h2>
                    </div>
                )}
                <section>{children}</section>

                {/* Footer avec bouton de confirmation */}
                {onConfirm && (
                    <div className="mt-4 text-center">
                        <button
                            type="button"
                            className={`bg-black text-white m-0 rounded-full px-4 py-2 hover:text-blueMain cursor-pointer hover:bg-white hover:text-black`}
                            disabled={onConfirm.disabled}
                            onClick={() => {
                                if (!onConfirm.disabled) {
                                    onConfirm.onClick();
                                }
                            }}
                        >
                            {onConfirm.label ? onConfirm.label : 'Valider'}
                        </button>
                    </div>
                )}
            </div>
        </div>,
        document.body,
    );
};

export default Modal;
