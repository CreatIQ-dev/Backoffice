import { Tooltip } from '../ui'
import React from 'react'
import { HiOutlineInformationCircle } from 'react-icons/hi2'

type InfoButtonProps = { title: string }

const InfoButton: React.FC<InfoButtonProps> = ({ title }) => {
    return (
        <Tooltip title={title}>
            <HiOutlineInformationCircle />
        </Tooltip>
    )
}

export default InfoButton
