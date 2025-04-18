import React, { Fragment, useState } from 'react';
import Footer from '../components/Footer';
import NavBar from '../components/NavBar';
import Modal from '../components/Utils/Modal';

import SignupForm from '../components/SignupForm';

interface RootLayoutProps {
    children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
    const [isLoginOpen, setIsModalOpen] = useState(false);
    const [isSignupOpen, setOpen] = useState(false);

    return (
        <Fragment>
            <NavBar
                variant="general"
                onLoginClick={() => setIsModalOpen(true)} // <-- ici
            />
            <main>{children}</main>

            <Modal isOpen={isSignupOpen} onClose={() => setOpen(false)}>
                <SignupForm />
            </Modal>
            <Footer />
        </Fragment>
    );
};

export default RootLayout;
