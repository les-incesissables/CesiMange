import React from 'react';

interface AlertProps {
    type?: string | null;
    message?: string | null;
    children?: React.ReactNode | null;
}

const Alert: React.FC<AlertProps> = ({ type = 'blue', message, children }) => {
    return <div className={`m-0 mt-2 mb-2 bg-${type} text-${type} text-sm border border-${type} p-2 rounded`}>{message || children}</div>;
};

export default Alert;
