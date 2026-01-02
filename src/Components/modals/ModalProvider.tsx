"use client";
import { createContext, useContext, useState } from "react";
import { modalType } from "./ModalTypes";

type modalState = {
    type: modalType,
    payload? : any
}

const ModalContext = createContext<any>(null);
export function ModalProvider( {children}: {children: React.ReactNode} ) {
    const [ modal, setModal ] = useState<modalState>({type: 'NONE'});
    
    const openModal = ( type: modalType, payload?: any ) => {
        setModal( { type, payload } );
    }

    const closeModal = () => {
        setModal( { type: 'NONE' } );
    }
    return (
        <ModalContext.Provider value={{ modal, openModal, closeModal }}>
            {children}
        </ModalContext.Provider>
    )
}

export const useModal = () => useContext(ModalContext)