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
        openModal('CONFIRM_ACTION', {
            title: 'Delete Client',
            message: `Are you sure you want to delete ${data.client.clientName || data.client.name}? This action cannot be undone.`,
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
                    <IconButton onClick={handleDelete}>
                        <DeleteIcon />
                    </IconButton>
                </div>
            </Popover>
        </div>
    );
}