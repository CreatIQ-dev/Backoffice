import { lazy } from 'react'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes = [
    {
        key: 'Home',
        path: '/home',
        component: lazy(() => import('@/views/Home')),
        authority: [],
    },
    {
        key: 'Onboarding',
        path: '/onboarding',
        component: lazy(() => import('@/views/Onboarding')),
        authority: [],
    },
    {
        key: 'Billing',
        path: '/billing',
        component: lazy(() => import('@/views/billing')),
        authority: [],
    },
    {
        key: 'QC History',
        path: '/qc-history',
        component: lazy(() => import('@/views/qc')),
        authority: [],
    },
    {
        key: 'CreditsAnalytics',
        path: '/analytics/credits',
        component: lazy(() => import('@/views/admin/credits/CreditsAnalytics')),
        authority: [],
    },
    {
        key: 'Profile',
        path: '/profile',
        component: lazy(() => import('@/views/profile')),
        authority: [],
    },
]
