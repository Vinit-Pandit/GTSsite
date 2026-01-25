"use client";
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';

import Client from '@/types/Client';
import { useModal } from '@/Components/modals/ModalProvider';
import * as api from '@/lib/api';

interface ClientWithAction extends Client {
    action?: string;
}

interface Column {
    id: keyof ClientWithAction;
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: any) => string;
}

const columns: readonly Column[] = [
    { id: 'siteName', label: 'Site Name', minWidth: 150 },
    { id: 'clientName', label: 'Client Name', minWidth: 150 },
    { id: 'siteBill', label: 'Site Bill', minWidth: 100, align: 'right', format: (value: number) => value.toLocaleString('en-US') },
    { id: 'paymentType', label: 'Payment Type', minWidth: 120 },
    { id: 'paymentRemaining', label: 'Payment Remaining', minWidth: 150, align: 'right', format: (value: number) => value.toLocaleString('en-US') },
    { id: 'remarks', label: 'Remarks', minWidth: 200 },
    { id: 'mobileNumber', label: 'Mobile Number', minWidth: 150 },
    { id: 'address', label: 'Address', minWidth: 200 },
    { id: 'date', label: 'Date', minWidth: 120 },
    { id: 'action', label: 'actions', minWidth: 100 },
];

export default function StickyHeadTableClient() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const { openModal } = useModal();
    const [clients, setClients] = React.useState<ClientWithAction[]>([]);

    React.useEffect(() => {
        (async () => {
            try {
                const data = await api.getClients();
                setClients(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('failed to load clients', err);
            }
        })();
    }, []);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleMoreActionClick = (event: React.MouseEvent<HTMLButtonElement>, rowIndex: number) => {
        const client = clients[rowIndex];
        console.log(client)
        openModal('MORE_ACTIONS', {
            id: 'more-actions-popover',
            anchorEl: event.currentTarget,
            client,
            onDeleted: (id: string) => {
                setClients(prev => prev.filter(c => c.id !== id));
            },
            onUpdated: (updated: any) => {
                setClients(prev => {
                    const without = prev.filter(c => c.id !== updated.id);
                    return [updated, ...without];
                });
            }
        });
    }

    const handleAddClientClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        openModal('EDIT_CLIENT', {
            client: null,
            open: true,
            onSave: async (newClient: any) => {
                try {
                    const saved = await api.addClient(newClient);
                    setClients(prev => [saved, ...prev]);
                } catch (err) {
                    console.error('Failed to add client', err);
                }
            }
        });
    }

    return (
        <Paper >
            <TableContainer sx={{ 
                minHeight: '90vh',
                bgcolor: (theme) => theme.palette.background.paper,
                borderRadius: 1,
                boxShadow: 1,
            }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    sx={(theme) => ({
                                        minWidth: column.minWidth,
                                        backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
                                        color: theme.palette.text.primary,
                                        fontWeight: 700,
                                        borderBottom: `2px solid ${theme.palette.divider}`,
                                        zIndex: 1,
                                    })}
                                >{column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {clients
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, rowIndex) => {
                                return (
                                    <TableRow 
                                        hover 
                                        role="checkbox" 
                                        tabIndex={-1} 
                                        key={row.id || rowIndex}
                                        sx={(theme) => ({
                                            '&:nth-of-type(odd)': {
                                                backgroundColor: theme.palette.action.hover,
                                            },
                                            '&:hover': {
                                                backgroundColor: theme.palette.action.selected,
                                            },
                                        })}
                                    >
                                        {columns.map((column) => {
                                            if (column.id === 'action') {
                                                return (
                                                    <TableCell 
                                                        key={`actions-${row.id}`} 
                                                        align="center"
                                                        sx={(theme) => ({
                                                            borderBottom: `1px solid ${theme.palette.divider}`,
                                                            py: 1,
                                                        })}
                                                    >
                                                        <IconButton size="small" onClick={ (e) => handleMoreActionClick(e, rowIndex)}>
                                                            <MoreVertIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                )
                                            }
                                            const value = (row as any)[column.id];
                                            return (
                                                <TableCell 
                                                    key={`${String(column.id)}-${row.id}`} 
                                                    align={column.align}
                                                    sx={(theme) => ({
                                                        borderBottom: `1px solid ${theme.palette.divider}`,
                                                        py: 1,
                                                        fontSize: '0.95rem',
                                                        color: theme.palette.text.secondary,
                                                    })}
                                                >
                                                    {column.format && typeof value === 'number'
                                                        ? column.format(value)
                                                        : (value ?? '-')}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={clients.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <IconButton sx={{
                position: 'fixed',
                left: "100px",
                bottom: "16px",
                bgcolor: 'background.paper',
                boxShadow: 3,
                backgroundRepeat: 'no-repeat',
            }}
            onClick={ (e) =>  handleAddClientClick(e)}
            >
                <AddIcon fontSize="large" color="primary" />
            </IconButton>
        </Paper>
    );
}