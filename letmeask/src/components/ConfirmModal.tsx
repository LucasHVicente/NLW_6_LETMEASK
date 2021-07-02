
import { ReactNode } from 'react';
import Modal from 'react-modal';

type ConfirmModalProps = {
    modalIsOpen: boolean;
    closeModal: ()=>void;
    children: ReactNode;
}

export function ConfirmModal({modalIsOpen, closeModal, children}:ConfirmModalProps) {

    return (
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
        >
            {children}
        </Modal>
    )
}
