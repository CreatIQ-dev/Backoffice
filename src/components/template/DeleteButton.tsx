import { IconButton, Tooltip } from '@mui/material'
import { HiOutlineTrash } from 'react-icons/hi2'
import React from 'react'

type DeleteButtonProps = {
    onDelete: () => void
    size: 'small' | 'medium' | 'large'
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onDelete, size }) => {
    return (
        <Tooltip title="Borrar  " arrow>
            <IconButton size={size} onClick={onDelete}>
                <HiOutlineTrash />
            </IconButton>
        </Tooltip>
    )
}

export default DeleteButton
