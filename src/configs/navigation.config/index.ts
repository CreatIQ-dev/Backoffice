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
        authority: [],
        subMenu: [
            {
                key: 'Home',
                path: '/home',
                title: 'Dashboard',
                translateKey: 'nav.home',
                icon: 'home',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'QC History',
                path: '/qc-history',
                title: 'QC Runs History',
                translateKey: 'nav.qcHistory',
                icon: 'qcHistory',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'CreditsAnalytics',
                path: '/analytics/credits',
                title: 'Credits Analytics',
                translateKey: 'nav.analytics',
                icon: 'analytics',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'Billing',
                path: '/billing',
                title: 'Credits Transactions',
                translateKey: 'nav.billing',
                icon: 'billing',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        ],
    },
]

export default navigationConfig
