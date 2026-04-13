import { useEffect } from 'react'
import { LOCAL_STORAGE_TOKEN_KEY } from '@/services/LocalStorageService'

const PluginAuthSync = () => {
    useEffect(() => {
        const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY)

        let cleanToken = null
        if (token) {
            cleanToken = token.replace(/^"|"$/g, '')
        }

        // Send the token (or null) to the parent window (the Frame.io extension content script)
        window.parent.postMessage(
            {
                type: 'CREATIQ_AUTH_TOKEN',
                token: cleanToken,
            },
            '*',
        )
    }, [])

    return <></> // Invisible component
}

export default PluginAuthSync
