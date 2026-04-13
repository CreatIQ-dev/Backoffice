import classNames from 'classnames'
import ScrollBar from '@/components/ui/ScrollBar'
import {
    SIDE_NAV_WIDTH,
    SIDE_NAV_COLLAPSED_WIDTH,
    NAV_MODE_DARK,
    NAV_MODE_THEMED,
    NAV_MODE_TRANSPARENT,
    SIDE_NAV_CONTENT_GUTTER,
    LOGO_X_GUTTER,
} from '@/constants/theme.constant'
import IsoLogo from '@/components/template/IsoLogo'
import navigationConfig from '@/configs/navigation.config'
import VerticalMenuContent from '@/components/template/VerticalMenuContent'
import useResponsive from '@/utils/hooks/useResponsive'
import { useAppSelector } from '@/store'
import Card from '@/components/ui/Card'

const sideNavStyle = {
    width: SIDE_NAV_WIDTH,
    minWidth: SIDE_NAV_WIDTH,
}

const sideNavCollapseStyle = {
    width: SIDE_NAV_COLLAPSED_WIDTH,
    minWidth: SIDE_NAV_COLLAPSED_WIDTH,
}

const SideNav = () => {
    const themeColor = useAppSelector((state) => state.theme.themeColor)
    const primaryColorLevel = useAppSelector(
        (state) => state.theme.primaryColorLevel,
    )
    const navMode = useAppSelector((state) => state.theme.navMode)
    const mode = useAppSelector((state) => state.theme.mode)
    const direction = useAppSelector((state) => state.theme.direction)
    const currentRouteKey = useAppSelector(
        (state) => state.base.common.currentRouteKey,
    )
    const sideNavCollapse = useAppSelector(
        (state) => state.theme.layout.sideNavCollapse,
    )
    const userAuthority = useAppSelector((state) => state.auth.user.authority)

    const { larger } = useResponsive()

    const sideNavColor = () => {
        if (navMode === NAV_MODE_THEMED) {
            return `bg-${themeColor}-${primaryColorLevel} side-nav-${navMode}`
        }
        return `side-nav-${navMode}`
    }

    const logoMode = () => {
        if (navMode === NAV_MODE_THEMED) {
            return NAV_MODE_DARK
        }

        if (navMode === NAV_MODE_TRANSPARENT) {
            return mode
        }

        return navMode
    }

    const menuContent = (
        <VerticalMenuContent
            navMode={navMode}
            collapsed={sideNavCollapse}
            navigationTree={navigationConfig}
            routeKey={currentRouteKey}
            userAuthority={userAuthority as string[]}
            direction={direction}
        />
    )

    return (
        <>
            {larger.md && (
                <div className="pl-4 pb-4 flex flex-col h-screen sticky py-4">
                    <Card
                        bodyClass="p-0 h-full flex flex-col bg-transparent"
                        className="h-full border border-border/50 bg-card/40 backdrop-blur-md shadow-xl rounded-[2.5rem] overflow-hidden"
                    >
                        <div
                            style={
                                sideNavCollapse
                                    ? sideNavCollapseStyle
                                    : sideNavStyle
                            }
                            className={classNames(
                                'side-nav h-full flex flex-col bg-transparent',
                                !sideNavCollapse && 'side-nav-expand',
                            )}
                        >
                            <div
                                className={classNames(
                                    'side-nav-header flex items-center p-6',
                                    sideNavCollapse
                                        ? 'justify-center'
                                        : 'justify-start',
                                )}
                            >
                                <IsoLogo
                                    mode={logoMode()}
                                    type={
                                        sideNavCollapse ? 'streamline' : 'full'
                                    }
                                    className={
                                        sideNavCollapse
                                            ? SIDE_NAV_CONTENT_GUTTER
                                            : LOGO_X_GUTTER
                                    }
                                />
                            </div>
                            {sideNavCollapse ? (
                                <div className="flex-1 overflow-y-auto">
                                    {menuContent}
                                </div>
                            ) : (
                                <div className="side-nav-content flex-1 overflow-hidden">
                                    <ScrollBar autoHide direction={direction}>
                                        {menuContent}
                                    </ScrollBar>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            )}
        </>
    )
}

export default SideNav
