import { useEffect } from 'react'
import { LOCAL_STORAGE_TOKEN_KEY } from '@/services/LocalStorageService'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'

const PluginConnect = () => {
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const sessionId = urlParams.get('session_id')
        const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY)
        const baseUrl =
            import.meta.env.VITE_API_BASE_URL ||
            'https://creatiq-backend.vercel.app'

        if (token) {
            // Eliminar comillas si las hay
            const cleanToken = token.replace(/^"|"$/g, '')
            // Redirigir al auth del backend pasándole el token y el session_id
            window.location.href = `${baseUrl}/auth/frameio?session_id=${sessionId}&token=${cleanToken}`
        } else {
            // No está logueado en el frontend, llevarlo al login y luego regresar a esta URL
            const currentUrl = encodeURIComponent(
                window.location.pathname + window.location.search,
            )
            window.location.href = `/sign-in?${REDIRECT_URL_KEY}=${currentUrl}`
        }
    }, [])

    return (
        <div className="flex h-screen w-full items-center justify-center bg-[#1a1a2e] text-white">
            <div className="flex flex-col items-center">
                <p className="mt-4 text-lg text-[#8b5cf6]">
                    Connecting to Frame.io...
                </p>
                <p className="text-sm text-gray-400">
                    Please wait while we securely connect your accounts.
                </p>
            </div>
        </div>
    )
}

export default PluginConnect
