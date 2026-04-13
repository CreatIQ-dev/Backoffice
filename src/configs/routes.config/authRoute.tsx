import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const authRoute: Routes = [
    {
        key: 'signIn',
        path: `/sign-in`,
        component: lazy(() => import('@/views/auth/SignIn/SignIn')),
        authority: [],
    },
    {
        key: 'signUp',
        path: `/sign-up`,
        component: lazy(() => import('@/views/auth/SignUp/SignUp')),
        authority: [],
    },
    {
        key: 'forgotPassword',
        path: `/forgot-password`,
        component: lazy(() => import('@/views/auth/ForgotPassword')),
        authority: [],
    },
    {
        key: 'resetPassword',
        path: `/reset-password`,
        component: lazy(() => import('@/views/auth/ResetPassword')),
        authority: [],
    },
    {
        key: 'pluginConnect',
        path: `/plugin-connect`,
        component: lazy(() => import('@/views/auth/PluginConnect')),
        authority: [],
    },
    {
        key: 'pluginAuthSync',
        path: `/plugin-auth-sync`,
        component: lazy(() => import('@/views/auth/PluginAuthSync')),
        authority: [],
    },
    {
        key: 'verifyEmail',
        path: `/verify-email`,
        component: lazy(() => import('@/views/auth/VerifyEmail/VerifyEmail')),
        authority: [],
    },
]

export default authRoute
