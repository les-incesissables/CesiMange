// src/context/SocketContext.tsx

import React, { createContext, ReactNode, useRef, useEffect } from 'react';
import socketIOClient, { Socket } from 'socket.io-client';
import { serverUrl } from '../utils/constants'; // Votre fichier constants.ts doit exporter serverUrl

// Définition de l'interface du contexte pour le socket
export interface ISocketContext {
    send: (event: string, data: any) => void;
    on: (event: string, callback: (data: any, message: any, socket: Socket) => void) => void;
    off: (event: string) => void;
    isConnected: () => boolean;
    connect: () => void;
    disconnect: () => void;
    get: () => Socket | null;
}

// Valeur par défaut pour le contexte
const defaultSocketContextValue: ISocketContext = {
    send: () => {},
    on: () => {},
    off: () => {},
    isConnected: () => false,
    connect: () => {},
    disconnect: () => {},
    get: () => null,
};

// Création du contexte
export const SocketContext = createContext<ISocketContext>(defaultSocketContextValue);

interface SocketProviderProps {
    children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    // Utilisation d'un ref pour stocker l'instance du socket.
    const IO = useRef<Socket | null>(null);

    // Fonction pour établir la connexion
    const connect = (): void => {
        //IO.current = socketIOClient(serverUrl, { transports: ['polling', 'websocket'] });
    };

    // Fonction pour se déconnecter
    const disconnect = (): void => {
        IO.current?.disconnect();
    };

    // Vérifie si le socket est connecté
    const isConnected = (): boolean => !!IO.current;

    // Méthode pour envoyer des messages
    const send = (event: string, data: any): void => {
        if (!isConnected()) connect();
        IO.current?.send(event, data);
    };

    // Méthode pour écouter un événement
    const on = (event: string, callback: (data: any, message: any, socket: Socket) => void): void => {
        if (!isConnected()) connect();
        IO.current?.on(event, (data: any, message: any) => {
            callback(data, message, IO.current as Socket);
        });
    };

    // Méthode pour retirer un écouteur d'événement
    const off = (event: string): void => {
        IO.current?.off(event);
    };

    // Méthode pour récupérer l'instance du socket
    const get = (): Socket | null => IO.current;

    const contextValue: ISocketContext = { send, on, off, isConnected, connect, disconnect, get };

    // Déconnexion lors du démontage du composant
    useEffect(() => {
        return () => {
            disconnect();
        };
    }, []);

    return <SocketContext.Provider value={contextValue}>{children}</SocketContext.Provider>;
};
