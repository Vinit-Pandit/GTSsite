"use client";

import * as React from "react";
import { Modal, Box, Typography, Button, Stack } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useModal } from "../ModalProvider";

interface payloadType {
  title?: string;
  message?: string;
  onConfirm: () => void;
}

export default function ConfirmActionModal({ payload } : { payload: payloadType  } ) {
  const { closeModal } = useModal();
  const {
    title = "Are you sure?",
    message = "This action can’t be reverted. Do you want to continue?",
    onConfirm,
  } = payload;

  const handleConfirm = () => {
    onConfirm();
    closeModal();
  };

  return (
    <Modal open onClose={closeModal}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 380,
          bgcolor: "background.paper",
          borderRadius: 2,
          p: 3,
          boxShadow: 24,
        }}
      >
        <Stack spacing={2} alignItems="center">
          <WarningAmberIcon color="warning" sx={{ fontSize: 48 }} />

          <Typography variant="h6" textAlign="center">
            {title}
          </Typography>

          <Typography variant="body2" textAlign="center" color="text.secondary">
            {message}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={2} mt={3} justifyContent="flex-end">
          <Button variant="outlined" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleConfirm}>
            Confirm
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
