import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE,
} from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'

const navigationConfig: NavigationTree[] = [
    {
        key: 'menu',
        path: '',
        title: 'MENU',
        translateKey: 'nav.menu',
        icon: '',
        type: NAV_ITEM_TYPE_TITLE,
        authority: ['ADMIN'],
        subMenu: [
            {
                key: 'Home',
                path: '/home',
                title: 'Dashboard',
                translateKey: 'nav.home',
                icon: 'home',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['ADMIN'],
                subMenu: [],
            },
            {
                key: 'PlatformSpecs',
                path: '/platform-specs',
                title: 'Platform Specs',
                translateKey: 'nav.platformSpecs',
                icon: 'platformSpecs',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['ADMIN'],
                subMenu: [],
            },
        ],
    },
]

export default navigationConfig
