import { useMemo, lazy, Suspense, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Loading from '@/components/shared/Loading'
import { useAppSelector } from '@/store'
import {
    LAYOUT_TYPE_CLASSIC,
    LAYOUT_TYPE_MODERN,
    LAYOUT_TYPE_SIMPLE,
    LAYOUT_TYPE_STACKED_SIDE,
    LAYOUT_TYPE_DECKED,
    LAYOUT_TYPE_BLANK,
} from '@/constants/theme.constant'
import useAuth from '@/utils/hooks/useAuth'
import useDirection from '@/utils/hooks/useDirection'
import PluginVersionModal from '@/components/template/PluginVersionModal'

const layouts = {
    [LAYOUT_TYPE_CLASSIC]: lazy(() => import('./ClassicLayout')),
    [LAYOUT_TYPE_MODERN]: lazy(() => import('./ModernLayout')),
    [LAYOUT_TYPE_STACKED_SIDE]: lazy(() => import('./StackedSideLayout')),
    [LAYOUT_TYPE_SIMPLE]: lazy(() => import('./SimpleLayout')),
    [LAYOUT_TYPE_DECKED]: lazy(() => import('./DeckedLayout')),
    [LAYOUT_TYPE_BLANK]: lazy(() => import('./BlankLayout')),
}

const Layout = () => {
    const layoutType = useAppSelector((state) => state.theme.layout.type)

    const onboardingSeen = useAppSelector(
        (state) => state.auth.user.onboardingSeen,
    )
    const pluginVersion = useAppSelector(
        (state) => state.auth.user.pluginVersion,
    )
    const { authenticated } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    useDirection()

    useEffect(() => {
        if (localStorage.getItem('creatiq_onboarding_seen')) {
            localStorage.removeItem('creatiq_onboarding_seen')
        }
    }, [])

    useEffect(() => {
        if (authenticated) {
            const localVersion = localStorage.getItem('creatiq_plugin_version')
            if (localVersion && localVersion !== pluginVersion) {
                import('@/services/UserService').then(
                    ({ apiUpdateUserProfile }) => {
                        apiUpdateUserProfile({
                            pluginVersion: localVersion,
                        }).catch(() => {})
                    },
                )
            }
        }
    }, [authenticated, pluginVersion])

    useEffect(() => {
        if (
            authenticated &&
            onboardingSeen === false &&
            location.pathname !== '/onboarding'
        ) {
            navigate('/onboarding')
        }
    }, [authenticated, onboardingSeen, navigate, location.pathname])

    const AppLayout = useMemo(() => {
        if (authenticated) {
            if (location.pathname === '/onboarding') {
                return layouts[LAYOUT_TYPE_BLANK]
            }
            return layouts[layoutType]
        }
        return lazy(() => import('./AuthLayout'))
    }, [layoutType, authenticated, location.pathname])

    return (
        <Suspense
            fallback={
                <div className="flex flex-auto flex-col h-[100vh]">
                    <Loading loading={true} />
                </div>
            }
        >
            <div className="aurora-bg min-h-screen">
                <div className="aurora-elements" />
                <AppLayout />
                {authenticated && location.pathname !== '/onboarding' && (
                    <PluginVersionModal />
                )}
            </div>
        </Suspense>
    )
}

export default Layout
