import ApiService from './ApiService'
import type {
    SignInCredential,
    SignUpCredential,
    ForgotPassword,
    ResetPassword,
    SignInResponse,
    SignUpResponse,
} from '@/@types/auth'

export interface BackendAuthResponse {
    ok: boolean
    msg: string
    uid: string
    nombre: string
    email: string
    rol: string
    credits?: number
    creditos?: number
    onboardingSeen?: boolean
    pluginVersion?: string
    token: string
}

export async function apiSignIn(data: SignInCredential) {
    const response = await ApiService.fetchData<BackendAuthResponse>({
        url: '/api/user-auth/login',
        method: 'post',
        data: {
            email: data.email,
            password: data.password,
        },
    })

    if (response.data && response.data.token) {
        const transformedData: SignInResponse = {
            token: response.data.token,
            user: {
                userName: response.data.nombre,
                email: response.data.email,
                authority: [response.data.rol || 'USER'],
                avatar: '',
                credits: response.data.creditos ?? response.data.credits ?? 0,
                onboardingSeen: response.data.onboardingSeen,
                pluginVersion: (response.data as any).pluginVersion,
            },
        }
        ;(response as any).data = transformedData
    }

    return response as any as { data: SignInResponse }
}

export async function apiSignUp(data: SignUpCredential) {
    const response = await ApiService.fetchData<BackendAuthResponse>({
        url: '/api/user-auth/register',
        method: 'post',
        data: {
            nombre: data.userName,
            email: data.email,
            password: data.password,
        },
    })

    if (response.data && response.data.token) {
        const transformedData: SignUpResponse = {
            token: response.data.token,
            user: {
                userName: response.data.nombre,
                email: response.data.email,
                authority: [response.data.rol || 'USER'],
                avatar: '',
                credits: response.data.creditos ?? response.data.credits ?? 0,
                onboardingSeen: response.data.onboardingSeen,
                pluginVersion: (response.data as any).pluginVersion,
            },
        }
        ;(response as any).data = transformedData
    }

    return response as any as { data: SignUpResponse }
}

export async function apiSignOut() {
    return ApiService.fetchData({
        url: '/sign-out',
        method: 'post',
    })
}

export async function apiForgotPassword(data: ForgotPassword) {
    return ApiService.fetchData({
        url: '/api/user-auth/forgot-password',
        method: 'post',
        data,
    })
}

export async function apiResetPassword(data: ResetPassword) {
    const { token, password } = data
    return ApiService.fetchData({
        url: `/api/user-auth/reset-password/${token}`,
        method: 'post',
        data: { password },
    })
}

export async function apiGoogleLogin(idToken: string) {
    const response = await ApiService.fetchData<BackendAuthResponse>({
        url: '/api/user-auth/google',
        method: 'post',
        data: { id_token: idToken },
    })

    if (response.data && response.data.ok) {
        const transformedData: SignInResponse = {
            token: response.data.token,
            user: {
                userName: response.data.nombre,
                email: response.data.email,
                avatar: (response.data as any).img || '',
                authority: [response.data.rol || 'USER'],
                credits: response.data.creditos ?? response.data.credits ?? 0,
                onboardingSeen: response.data.onboardingSeen,
                pluginVersion: (response.data as any).pluginVersion,
            },
        }
        ;(response as any).data = transformedData
    }

    return response as any as { data: SignInResponse }
}

export async function apiGetFrameioStatus() {
    return ApiService.fetchData<{
        ok: boolean
        connected?: boolean
        user?: { name: string; email: string }
        status?: string
    }>({
        url: `/api/auth/check?t=${new Date().getTime()}`,
        method: 'get',
    })
}

export async function apiVerifyEmail(token: string) {
    return ApiService.fetchData<{ ok: boolean; msg: string }>({
        url: `/api/user-auth/verify-email/${token}`,
        method: 'get',
    })
}
