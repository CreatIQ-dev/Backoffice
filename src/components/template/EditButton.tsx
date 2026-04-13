import { IconButton, Tooltip } from '@mui/material'
import React from 'react'
import { HiOutlinePencilSquare } from 'react-icons/hi2'

type EditButtonProps = {
    isOpen: () => void
    size: 'small' | 'medium' | 'large'
}

const EditButton: React.FC<EditButtonProps> = ({ isOpen, size }) => {
    return (
        <Tooltip title="Editar" arrow>
            <IconButton size={size} onClick={isOpen}>
                <HiOutlinePencilSquare />
            </IconButton>
        </Tooltip>
    )
}

export default EditButton
