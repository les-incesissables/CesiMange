import React, { Fragment, useCallback, useContext, useRef, useState } from 'react';
import Footer from '../components/Footer';
import NavBar from '../components/NavBar';
import Modal from '../components/Utils/Modal';
import FormLogin, { FormConnexionHandle } from '../components/forms/FormLogin';
import { AuthContext } from '../context/AuthContext';

interface WelcomeLayoutProps {
    children: React.ReactNode;
}

const WelcomeLayout: React.FC<WelcomeLayoutProps> = ({ children }) => {
    /*     const [isLoginOpen, setIsModalOpen] = useState(false);
    const [isSignupOpen, setOpen] = useState(false); */
    //CONTEXTS
    const [authState] = useContext(AuthContext);

    const [isConnexionOpen, setIsConnexionOpen] = useState(false);
    const [modalConfirmLabel, setModalConfirmLabel] = useState('Valider');
    const [isLogged, setIsLogged] = useState(false);

    const loginRef = useRef<FormConnexionHandle>(null);

    function onLogged(status: any) {
        setIsLogged(status);
    }

    const onConfirm = !isLogged
        ? {
              label: modalConfirmLabel,
              class: 'font-bold', // Vous pouvez ajouter d'autres classes ici
              onClick: () => {
                  loginRef.current?.login();
              },
          }
        : false;

    return (
        <Fragment>
            <NavBar variant="general" onLoginClick={() => setIsConnexionOpen(true)} />
            <main>{children}</main>
            <Footer />
            <Modal isOpen={isConnexionOpen} onConfirm={onConfirm} onClose={() => setIsConnexionOpen(false)}>
                <FormLogin
                    ref={loginRef}
                    onLogged={() => setIsConnexionOpen(false)}
                    isLogged={(status) => onLogged(status)}
                    modalConfirmLabel={(label) => setModalConfirmLabel(label)}
                />
            </Modal>
        </Fragment>
    );
};

export default WelcomeLayout;
