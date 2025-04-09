import React from 'react';

interface AlertProps {
    type?: string | null;
    message?: string | null;
    children?: React.ReactNode | null;
}

const Alert: React.FC<AlertProps> = ({ type = 'blue', message, children }) => {
    return <div className={`m-0 mt-2 mb-2 bg-${type}-100 text-${type}-500 text-sm border border-${type}-600 p-2 rounded`}>{message || children}</div>;
};

export default Alert;
