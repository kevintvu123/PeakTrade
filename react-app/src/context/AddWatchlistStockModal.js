import React, { useContext, useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./AddWatchlistStockModal.css";

const AddWatchlistStockModalContext = React.createContext();

export function AddWatchlistStockModalProvider({ children }) {
    const modalRef = useRef();
    const [value, setValue] = useState();

    useEffect(() => {
        setValue(modalRef.current);
    }, []);

    return (
        <>
            <AddWatchlistStockModalContext.Provider value={value}>{children}</AddWatchlistStockModalContext.Provider>
            <div ref={modalRef} />
        </>
    );
}

export function AddWatchlistStockModal({ onClose, children }) {
    const modalNode = useContext(AddWatchlistStockModalContext);
    if (!modalNode) return null;

    return ReactDOM.createPortal(
        <div id="watchlist-stock-modal">
            <div id="watchlist-stock-modal-background" onClick={onClose} />
            <div id="watchlist-stock-modal-content">{children}</div>
        </div>,
        modalNode
    );
}