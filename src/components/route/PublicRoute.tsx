import { Navigate, Outlet, useLocation } from 'react-router-dom'
import appConfig from '@/configs/app.config'
import useAuth from '@/utils/hooks/useAuth'

const { authenticatedEntryPath } = appConfig

const PublicRoute = () => {
    const { authenticated } = useAuth()
    const location = useLocation()

    // bypass redirect for specific auth paths that a logged in user might click from email
    const bypassPaths = ['/reset-password', '/verify-email']
    const isBypass = bypassPaths.some(p => location.pathname.startsWith(p))

    return authenticated && !isBypass ? <Navigate to={authenticatedEntryPath} /> : <Outlet />
}

export default PublicRoute
