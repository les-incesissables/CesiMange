// components/PopupContainer.tsx
import React from 'react';

interface PopupContainerProps {
    header?: React.ReactNode;
    children: React.ReactNode; // Body
    footer?: React.ReactNode;
}

const PopupContainer: React.FC<PopupContainerProps> = ({ header, children, footer }) => {
    return (
        <div className="flex w-[474px] flex-col gap-6 rounded-2xl bg-stone-300 p-6 shadow-xl outline outline-1 outline-black">
            {/* Header */}
            {header && (
                <div className="text-center text-3xl font-semibold text-black">
                    {header}
                    <div className="mt-2 h-px w-full bg-black" />
                </div>
            )}

            {/* Body */}
            <div className="flex flex-col gap-6">{children}</div>

            {/* Footer */}
            {footer && (
                <>
                    <div className="h-px w-full bg-black" />
                    <div>{footer}</div>
                </>
            )}
        </div>
    );
};

export default PopupContainer;
