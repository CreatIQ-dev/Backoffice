import React from 'react'
import { Divider } from '@mui/material'

const DividerMain = () => {
    return (
        <div>
            <Divider
                style={{
                    borderColor: 'var(--theme-primary-color)',
                    borderWidth: 1,
                    opacity: 0.2,
                }}
            />
        </div>
    )
}

export default DividerMain
