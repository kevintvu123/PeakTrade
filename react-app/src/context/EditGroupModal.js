import React, { useContext, useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./EditGroupModal.css";

const EditGroupModalContext = React.createContext();

export function EditGroupModalProvider({ children }) {
    const modalRef = useRef();
    const [value, setValue] = useState();

    useEffect(() => {
        setValue(modalRef.current);
    }, []);

    return (
        <>
            <EditGroupModalContext.Provider value={value}>{children}</EditGroupModalContext.Provider>
            <div ref={modalRef} />
        </>
    );
}

export function EditGroupModal({ onClose, children }) {
    const modalNode = useContext(EditGroupModalContext);
    if (!modalNode) return null;

    return ReactDOM.createPortal(
        <div id="group-modal">
            <div id="group-modal-background" onClick={onClose} />
            <div id="group-modal-content">{children}</div>
        </div>,
        modalNode
    );
}