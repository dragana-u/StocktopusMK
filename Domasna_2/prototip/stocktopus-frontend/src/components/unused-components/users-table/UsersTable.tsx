import React, { useState } from 'react';
import {
    TablePagination,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
} from '@mui/material';
import styles from '../../../pages/Users/Users.module.css';
import SuccessOrErrorDialog from '../../successOrErrorDialog/SuccessOrErrorDialog.tsx';
import { UserDetailsDTO } from '../../../model/dto/UserDetailsDTO.ts';

interface UsersTableProps {
    users: UserDetailsDTO[];
    totalCount: number;
    onDelete: (username: string) => Promise<void>;
}

export const UsersTable: React.FC<UsersTableProps> = ({ users, totalCount, onDelete }) => {
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(25);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [dialogType, setDialogType] = useState<'success' | 'error'>('success');
    const [selectedUsername, setSelectedUsername] = useState<string | null>(null);

    const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSize(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDeleteClick = (username: string) => {
        setSelectedUsername(username);
        setOpenDeleteDialog(true);
    };

    const confirmDelete = async () => {
        if (selectedUsername) {
            try {
                await onDelete(selectedUsername);
                setDialogMessage('The user was successfully deleted.');
                setDialogType('success');
            } catch  {
                setDialogMessage('There was an error processing your request.');
                setDialogType('error');
            } finally {
                setOpenDeleteDialog(false);
                setSelectedUsername(null);
            }
        }
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setSelectedUsername(null);
    };

    const handleCloseDialog = () => {
        setDialogMessage('');
    };

    return (
        <div>
            <div className={styles.tableContainer}>
                <div className={styles.tableHeader}>
                    <div className={styles.headerCell}>Username</div>
                    <div className={styles.headerCell}>Email</div>
                    <div className={styles.headerCell}>Role</div>
                    <div className={styles.headerCell}>Actions</div>
                </div>
                {users.map((user) => (
                    <div className={styles.tableRow} key={user.username}>
                        <div className={styles.rowCell}>{user.username}</div>
                        <div className={styles.rowCell}>{user.email}</div>
                        <div className={styles.rowCell}>{user.role}</div>
                        <div className={styles.rowCell}>
                            <button
                                className={styles.deleteButton}
                                onClick={() => handleDeleteClick(user.username)}
                                aria-label={`Delete ${user.username} data`}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <TablePagination
                component="div"
                count={totalCount}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={size}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">{"Confirm Delete"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Are you sure you want to delete this user?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmDelete} color="secondary" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <SuccessOrErrorDialog
                open={!!dialogMessage}
                message={dialogMessage}
                onClose={handleCloseDialog}
                type={dialogType}
            />
        </div>
    );
};