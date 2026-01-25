import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useModal } from '../ModalProvider';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import * as api from '@/lib/api';

export default function MoreActions({ data }: { data: any }) {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(data.anchorEl);
    const { closeModal, openModal } = useModal();

    const handleClose = () => {
        setAnchorEl(null);
        closeModal();
    };

    const openEditModal = () => {
        // If karigar payload is present, open karigar editor
        if (data.karigar) {
            openModal('EDIT_KARIGAR', {
                karigar: data.karigar,
                open: true,
                onSave: async (updatedKarigar: any) => {
                    try {
                        let saved;
                        // prefer updateKarigar if available, otherwise fall back to addKarigar
                        if (updatedKarigar.id && (api as any).updateKarigar) {
                            saved = await (api as any).updateKarigar(updatedKarigar.id, updatedKarigar);
                        } else {
                            saved = await api.addKarigar(updatedKarigar);
                        }
                        if (typeof data.onUpdated === 'function') data.onUpdated(saved);
                        closeModal();
                    } catch (err) {
                        console.error('Error saving karigar', err);
                    }
                }
            });
            return;
        }

        // default: client
        console.log('Opening edit modal for client:', data.client);
        openModal('EDIT_CLIENT', {
            client: data.client,
            open: true,
            onSave: async (updatedClient: any) => {
                try {
                    let saved;
                    if (updatedClient.id) {
                        // update existing
                        saved = await api.updateClient(updatedClient.id, updatedClient);
                    } else {
                        // create new
                        saved = await api.addClient(updatedClient);
                    }
                    console.log('Client saved', saved);
                    // notify parent to refresh/update UI if callback provided
                    if (typeof data.onUpdated === 'function') data.onUpdated(saved);
                    closeModal();
                } catch (err) {
                    console.error('Error saving client', err);
                }
            }
        });
    }

    const handleDelete = () => {
        // If karigar and deleteKarigar exists, call it; otherwise only support client deletion
        if (data.karigar) {
            if ((api as any).deleteKarigar && data.karigar.id) {
                openModal('CONFIRM_ACTION', {
                    title: 'Delete Karigar',
                    message: `Are you sure you want to delete ${data.karigar.karigarName}? This action cannot be undone.`,
                    onConfirm: async () => {
                        try {
                            const resp = await (api as any).deleteKarigar(data.karigar.id);
                            console.log('Karigar deleted', resp);
                            if (typeof data.onDeleted === 'function') data.onDeleted(data.karigar.id);
                            closeModal();
                        } catch (err) {
                            console.error('Error deleting karigar', err);
                        }
                    }
                });
                return;
            }

            // deletion not available for karigar via API
            console.warn('Delete not supported for karigar (no deleteKarigar API)');
            closeModal();
            return;
        }

        // client deletion
        openModal('CONFIRM_ACTION', {
            title: 'Delete Client',
            message: `Are you sure you want to delete ${data.client?.clientName || data.client?.name}? This action cannot be undone.`,
            onConfirm: async () => {
                try {
                    if (!data.client?.id) {
                        console.warn('No id present on client; cannot delete');
                        return;
                    }
                    const resp = await api.deleteClient(data.client.id);
                    console.log('Client deleted', resp);
                    if (typeof data.onDeleted === 'function') data.onDeleted(data.client.id);
                    closeModal();
                } catch (err) {
                    console.error('Error deleting client', err);
                }
            }
        });
    }

    return (
        <div>
            <Popover
                id={data.id ? data.id : 'simple-popover'}
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <div className='actionIconContainer' >
                    <IconButton onClick={openEditModal}>
                        <EditIcon />
                    </IconButton>


                    {/* show delete for clients always; for karigars only if deleteKarigar helper exists */}
                    {(!data.karigar || (api as any).deleteKarigar) && (
                        <IconButton onClick={handleDelete}>
                            <DeleteIcon />
                        </IconButton>
                    )}

                </div>
            </Popover>
        </div>
    );
}