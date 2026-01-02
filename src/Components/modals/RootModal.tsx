"use client";
import MoreActions from "./moreActionsModal";
import EditClientModal from "./editClientModal";
import { useModal } from "./ModalProvider";
import ConfirmActionModal from "./warningNoRevertModal/NoRevertModal";
import { modalType } from "./ModalTypes";

export default function RootModal() {
    const { modal } = useModal();
    switch (modal.type) {
        case 'MORE_ACTIONS':
            return <MoreActions data={modal.payload} />
        case 'EDIT_CLIENT':
            return <EditClientModal payload={modal.payload} />
        case 'CONFIRM_ACTION':
            return <ConfirmActionModal payload={modal.payload} />
        default:
            return null;
    }
}