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
import Client from "@/types/Client";
import { PAYMENT_TYPES_ARRAY, PaymentTypes } from "@/types/PaymentTypes";
import { useModal } from "../ModalProvider";
import "./editClientModal.css";

interface PayloadType {
    open: boolean;
    client: Client;
    onClose?: () => void;
    onSave: (updatedClient: Client) => void;
}

const defaultClient: Client = {
    siteName: '',
    clientName: '',
    siteBill: 0,
    paymentType: 'CASH' as PaymentTypes,
    paymentRemaining: 0,
    remarks: '',
    driveLink: '',
    mobileNumber: '',
    address: '',
    architectureOrPMC: '',
    date: new Date().toISOString(),
};

export default function EditClientModal({ payload }: { payload: PayloadType }) {
    const [editedClient, setEditedClient] = useState<Client>(defaultClient);
    const [open, setOpen] = useState<boolean>(payload.open);
    const { closeModal } = useModal();
    console.log("EditClientModal payload:", payload);

    useEffect(() => {
        if (payload.client) {
            setEditedClient(prev => ({ ...defaultClient, ...payload.client }));
        } else {
            setEditedClient(defaultClient);
        }
    }, [payload.client]);

    const handleChange = (field: keyof Client, value: any) => {
        setEditedClient((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        payload.onSave(editedClient);
        onClose();
    };

    const onClose = () => {
        setOpen(false);
    }

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute" as "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    // width: 500,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <Typography variant="h6" mb={2}>
                    Edit Client
                </Typography>

                <div className="field-container">
                    <TextField
                        label="Site Name"
                        value={editedClient.siteName ?? ''}
                        onChange={(e) => handleChange("siteName", e.target.value)}
                        fullWidth
                    />

                    <TextField
                        label="Client Name"
                        value={editedClient.clientName ?? ''}
                        onChange={(e) => handleChange("clientName", e.target.value)}
                        fullWidth
                    />

                    <TextField
                        label="Site Bill"
                        type="number"
                        value={editedClient.siteBill ?? 0}
                        onChange={(e) => handleChange("siteBill", Number(e.target.value))}
                        fullWidth
                    />

                    <TextField
                        select
                        label="Payment Type"
                        value={editedClient.paymentType ?? 'CASH'}
                        onChange={(e) =>
                            handleChange("paymentType", e.target.value as PaymentTypes)
                        }
                        fullWidth
                    >
                        {PAYMENT_TYPES_ARRAY.map((type) => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Payment Remaining"
                        type="number"
                        value={editedClient.paymentRemaining ?? 0}
                        onChange={(e) =>
                            handleChange("paymentRemaining", Number(e.target.value))
                        }
                        fullWidth
                    />

                    <TextField
                        label="Remarks"
                        value={editedClient.remarks ?? ''}
                        onChange={(e) => handleChange("remarks", e.target.value)}
                        fullWidth
                    />

                    <TextField
                        label="Drive Link"
                        value={editedClient.driveLink ?? ''}
                        onChange={(e) => handleChange("driveLink", e.target.value)}
                        fullWidth
                    />

                    <TextField
                        label="Mobile Number"
                        value={editedClient.mobileNumber ?? ''}
                        onChange={(e) => handleChange("mobileNumber", e.target.value)}
                        fullWidth
                    />

                    <TextField
                        label="Address"
                        value={editedClient.address ?? ''}
                        onChange={(e) => handleChange("address", e.target.value)}
                        fullWidth
                    />

                    <TextField
                        label="Architecture/PMC"
                        value={editedClient.architectureOrPMC ?? ''}
                        onChange={(e) =>
                            handleChange("architectureOrPMC", e.target.value)
                        }
                        fullWidth
                    />

                    <TextField
                        label="Date"
                        type="date"
                        value={editedClient.date ?? new Date().toISOString()}
                        onChange={(e) => handleChange("date", e.target.value)}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
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
