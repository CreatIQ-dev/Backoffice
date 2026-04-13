import ApiService from './ApiService'

export type UserProfileResponse = {
    ok: boolean
    usuario: {
        uid: string
        nombre: string
        email: string
        rol: string
        creditos: number
        img?: string
        google: boolean
        fromFrameio: boolean
        onboardingSeen: boolean
        pluginVersion?: string
    }
}

export type UpdateProfilePayload = {
    nombre?: string
    email?: string
    img?: string
    onboardingSeen?: boolean
    pluginVersion?: string
}

export type UpdatePasswordPayload = {
    oldPassword?: string
    newPassword?: string
}

export async function apiGetUserProfile() {
    return ApiService.fetchData<UserProfileResponse>({
        url: '/api/user/profile',
        method: 'get',
    })
}

export async function apiUpdateUserProfile(data: UpdateProfilePayload) {
    return ApiService.fetchData<{ ok: boolean; msg: string; usuario: any }>({
        url: '/api/user/profile',
        method: 'put',
        data,
    })
}

export async function apiUpdateUserPassword(data: UpdatePasswordPayload) {
    return ApiService.fetchData<{ ok: boolean; msg: string }>({
        url: '/api/user/password',
        method: 'put',
        data,
    })
}

export async function apiDeleteUserAccount() {
    return ApiService.fetchData<{ ok: boolean; msg: string }>({
        url: '/api/user/profile',
        method: 'delete',
    })
}
