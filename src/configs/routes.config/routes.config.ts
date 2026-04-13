import { lazy } from 'react'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes = [
    {
        key: 'Home',
        path: '/home',
        component: lazy(() => import('@/views/Home')),
        authority: ['ADMIN'],
    },
    {
        key: 'Profile',
        path: '/profile',
        component: lazy(() => import('@/views/profile')),
        authority: ['ADMIN'],
    },
    {
        key: 'PlatformSpecs',
        path: '/platform-specs',
        component: lazy(() => import('@/views/admin/PlatformSpecs/PlatformSpecs')),
        authority: ['ADMIN'],
    },
]
