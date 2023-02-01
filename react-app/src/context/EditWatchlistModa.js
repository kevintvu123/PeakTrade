import React, { useContext, useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./EditWatchlistModal.css";

const EditWatchlistModalContext = React.createContext();

export function EditWatchlistModalProvider({ children }) {
    const modalRef = useRef();
    const [value, setValue] = useState();

    useEffect(() => {
        setValue(modalRef.current);
    }, []);

    return (
        <>
            <EditWatchlistModalContext.Provider value={value}>{children}</EditWatchlistModalContext.Provider>
            <div ref={modalRef} />
        </>
    );
}

export function EditWatchlistModal({ onClose, children }) {
    const modalNode = useContext(EditWatchlistModalContext);
    if (!modalNode) return null;

    return ReactDOM.createPortal(
        <div id="watchlist-modal">
            <div id="watchlist-modal-background" onClick={onClose} />
            <div id="watchlist-modal-content">{children}</div>
        </div>,
        modalNode
    );
}