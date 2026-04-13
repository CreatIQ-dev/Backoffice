import BaseService from '@/services/BaseService'
import type {
    SignInResponse,
    SignUpCredential,
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
    token: string
}

export const fetchUpdatePassword = async (
    userId: string,
    oldPassword: string,
    newPassword: string,
): Promise<boolean> => {
    try {
        await BaseService.put(`/update-pass/${userId}`, {
            contrasena_actual: oldPassword,
            nueva_contrasena: newPassword,
        })
        return true
    } catch (error: any) {
        console.error('Error al actualizar la contraseña:', error)
        throw error
    }
}

export const fetchLoginUser = async (
    email: string,
    password: string,
): Promise<SignInResponse> => {
    try {
        const response = await BaseService.post<BackendAuthResponse>(
            '/api/user-auth/login',
            {
                email,
                password,
            },
        )
        const data = response.data
        return {
            token: data.token,
            user: {
                userName: data.nombre,
                email: data.email,
                authority: [data.rol || 'USER'],
                avatar: '',
                credits: data.creditos ?? data.credits ?? 0,
            },
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error)
        throw error
    }
}

export const fetchRegisterUser = async (
    data: SignUpCredential,
): Promise<SignUpResponse> => {
    try {
        const response = await BaseService.post<BackendAuthResponse>(
            '/api/user-auth/register',
            {
                nombre: data.userName,
                email: data.email,
                password: data.password,
            },
        )
        const resData = response.data
        return {
            token: resData.token,
            user: {
                userName: resData.nombre,
                email: resData.email,
                authority: [resData.rol || 'USER'],
                avatar: '',
                credits: resData.creditos ?? resData.credits ?? 0,
            },
        }
    } catch (error) {
        console.error('Error al registrar usuario:', error)
        throw error
    }
}

export const fetchUsers = async (): Promise<any> => {
    try {
        const response = await BaseService.get('/api/user')
        return response.data
    } catch (error) {
        console.error('Error fetching users:', error)
        throw error
    }
}
