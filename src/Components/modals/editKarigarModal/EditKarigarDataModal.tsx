"use client";

import React, { useState, useEffect } from "react";
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    MenuItem,
    Stack,
} from "@mui/material";
import Karigar from "@/types/Karigar";
import { PAYMENT_TYPES_ARRAY, PaymentTypes } from "@/types/PaymentTypes";
import { useModal } from "../ModalProvider";
import "./editClientModal.css";

interface PayloadType {
    open: boolean;
    karigar: Karigar | null;
    onClose?: () => void;
    onSave: (updated: Karigar) => void;
}

const defaultKarigar: Karigar = {
    siteName: '',
    karigarName: '',
    karigarSiteBill: 0,
    paymentType: 'cash' as PaymentTypes,
    referenceOrChequeNumber: '',
    bankName: '',
    paymentAmount: 0,
    paymentDate: new Date().toISOString().slice(0,10),
    paymentDoneBy: '',
    remainingAmount: 0,
    paymentGivenBy: '',
    documentLinkTitle: '',
    documentDriveLink: ''
};

export default function EditKarigarModal({ payload }: { payload: PayloadType }) {
    const [editedKarigar, setEditedKarigar] = useState<Karigar>(defaultKarigar);
    const [open, setOpen] = useState<boolean>(payload.open);
    const { closeModal } = useModal();

    useEffect(() => {
        if (payload.karigar) {
            setEditedKarigar(prev => ({ ...defaultKarigar, ...payload.karigar }));
        } else {
            setEditedKarigar(defaultKarigar);
        }
    }, [payload.karigar]);

    const handleChange = (field: keyof Karigar, value: any) => {
        setEditedKarigar((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        payload.onSave(editedKarigar);
        onClose();
    };

    const onClose = () => {
        setOpen(false);
        closeModal();
    }

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute" as "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <Typography variant="h6" mb={2}>
                    Edit Karigar
                </Typography>

                <div className="field-container">
                    <TextField
                        label="Site Name"
                        value={editedKarigar.siteName ?? ''}
                        onChange={(e) => handleChange("siteName", e.target.value)}
                        fullWidth
                    />

                    <TextField
                        label="Karigar Name"
                        value={editedKarigar.karigarName ?? ''}
                        onChange={(e) => handleChange("karigarName", e.target.value)}
                        fullWidth
                    />

                    <TextField
                        label="Karigar Site Bill"
                        type="number"
                        value={editedKarigar.karigarSiteBill ?? 0}
                        onChange={(e) => handleChange("karigarSiteBill", Number(e.target.value))}
                        fullWidth
                    />

                    <TextField
                        select
                        label="Payment Type"
                        value={editedKarigar.paymentType ?? 'cash'}
                        onChange={(e) => handleChange("paymentType", e.target.value as PaymentTypes)}
                        fullWidth
                    >
                        {PAYMENT_TYPES_ARRAY.map((type) => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Reference / Cheque Number"
                        value={editedKarigar.referenceOrChequeNumber ?? ''}
                        onChange={(e) => handleChange("referenceOrChequeNumber", e.target.value)}
                        fullWidth
                    />

                    <TextField
                        label="Bank Name"
                        value={editedKarigar.bankName ?? ''}
                        onChange={(e) => handleChange("bankName", e.target.value)}
                        fullWidth
                    />

                    <TextField
                        label="Payment Amount"
                        type="number"
                        value={editedKarigar.paymentAmount ?? 0}
                        onChange={(e) => handleChange("paymentAmount", Number(e.target.value))}
                        fullWidth
                    />

                    <TextField
                        label="Payment Date"
                        type="date"
                        value={editedKarigar.paymentDate ?? new Date().toISOString().slice(0,10)}
                        onChange={(e) => handleChange("paymentDate", e.target.value)}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />

                    <TextField
                        label="Payment Done By"
                        value={editedKarigar.paymentDoneBy ?? ''}
                        onChange={(e) => handleChange("paymentDoneBy", e.target.value)}
                        fullWidth
                    />

                    <TextField
                        label="Remaining Amount"
                        type="number"
                        value={editedKarigar.remainingAmount ?? 0}
                        onChange={(e) => handleChange("remainingAmount", Number(e.target.value))}
                        fullWidth
                    />

                    <TextField
                        label="Payment Given By"
                        value={editedKarigar.paymentGivenBy ?? ''}
                        onChange={(e) => handleChange("paymentGivenBy", e.target.value)}
                        fullWidth
                    />

                    <TextField
                        label="Document Title"
                        value={editedKarigar.documentLinkTitle ?? ''}
                        onChange={(e) => handleChange("documentLinkTitle", e.target.value)}
                        fullWidth
                    />

                    <TextField
                        label="Document Drive Link"
                        value={editedKarigar.documentDriveLink ?? ''}
                        onChange={(e) => handleChange("documentDriveLink", e.target.value)}
                        fullWidth
                    />
                </div>

                <Stack direction="row" spacing={2} mt={3} justifyContent="flex-end">
                    <Button variant="outlined" color="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Save
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
}
