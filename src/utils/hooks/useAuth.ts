import { apiSignIn, apiSignUp } from '@/services/AuthService'
import {
    setUser,
    setCredits,
    signInSuccess,
    signOutSuccess,
    useAppSelector,
    useAppDispatch,
} from '@/store'
import appConfig from '@/configs/app.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useNavigate } from 'react-router-dom'
import useQuery from './useQuery'
import type { SignInCredential, SignUpCredential } from '@/@types/auth'
import {
    LOCAL_STORAGE_USER_KEY,
    LOCAL_STORAGE_TOKEN_KEY,
} from '../../services/LocalStorageService'

type Status = 'success' | 'failed'

function useAuth() {
    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const query = useQuery()

    const { token, signedIn } = useAppSelector((state) => state.auth.session)

    const signIn = async (
        values: SignInCredential,
    ): Promise<
        | {
              status: Status
              message: string
          }
        | undefined
    > => {
        try {
            const resp = await apiSignIn(values)

            if (resp.data && resp.data.token) {
                const { token, user: userData } = resp.data
                const authority = userData?.authority || ['USER']

                if (!authority.includes('ADMIN')) {
                    return {
                        status: 'failed',
                        message: 'Access denied. Only administrators are allowed to log in.',
                    }
                }

                dispatch(signInSuccess(token))

                const user = {
                    avatar: userData?.avatar || '',
                    userName: userData?.userName || 'Anonymous',
                    authority: authority,
                    email: userData?.email || '',
                    invites: [],
                    credits: userData?.credits ?? 0,
                }

                dispatch(setUser(user))

                localStorage.setItem(
                    LOCAL_STORAGE_USER_KEY,
                    JSON.stringify(user),
                )
                localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token)

                const redirectUrl =
                    query.get(REDIRECT_URL_KEY) || appConfig.authenticatedEntryPath
                navigate(redirectUrl)

                return {
                    status: 'success',
                    message: '',
                }
            }
        } catch (errors: any) {
            return {
                status: 'failed',
                message:
                    errors?.response?.data?.msg ||
                    errors?.response?.data?.message ||
                    errors.toString(),
            }
        }
    }

    const signUp = async (
        values: SignUpCredential,
    ): Promise<
        | { status: Status; message: string; needsVerification?: boolean }
        | undefined
    > => {
        try {
            const resp = await apiSignUp(values)
            if (resp.data) {
                if (resp.data.token) {
                    const { token, user: userData } = resp.data
                    const authority = userData?.authority || ['USER']

                    if (!authority.includes('ADMIN')) {
                        return {
                            status: 'failed',
                            message: 'Registration successful, but access is restricted to administrators only.',
                        }
                    }

                    dispatch(signInSuccess(token))
                    if (userData) {
                        const user = {
                            avatar: userData?.avatar || '',
                            userName: userData?.userName || 'Anonymous',
                            authority: authority,
                            email: userData?.email || '',
                            invites: [],
                            credits: userData?.credits ?? 0,
                        }
                        dispatch(setUser(user))
                    }
                    const redirectUrl = query.get(REDIRECT_URL_KEY)
                    navigate(
                        redirectUrl
                            ? redirectUrl
                            : appConfig.authenticatedEntryPath,
                    )
                    return {
                        status: 'success',
                        message: '',
                    }
                } else {
                    return {
                        status: 'success',
                        message:
                            (resp.data as any).msg ||
                            'Please check your email to verify your account.',
                        needsVerification: true,
                    }
                }
            }
        } catch (errors: any) {
            return {
                status: 'failed',
                message:
                    errors?.response?.data?.msg ||
                    errors?.response?.data?.message ||
                    errors.toString(),
            }
        }
    }

    const handleSignOut = () => {
        dispatch(signOutSuccess())
        dispatch(
            setUser({
                avatar: '',
                userName: '',
                email: '',
                authority: [],
                invites: [],
            }),
        )
        sessionStorage.removeItem('clients_onboarding_session_seen')
        sessionStorage.removeItem('client_card_onboarding_session_seen')
        sessionStorage.removeItem('business_unit_onboarding_session_seen')
        sessionStorage.removeItem('projects_onboarding_session_seen')
        sessionStorage.removeItem('project_card_onboarding_session_seen')
        navigate(appConfig.unAuthenticatedEntryPath)
    }

    const signOut = async () => {
        handleSignOut()
    }

    const getProfile = async () => {
        try {
            const { apiGetUserProfile } = await import('@/services/UserService')
            const resp = await apiGetUserProfile()
            if (resp.data?.ok && resp.data.usuario) {
                const { usuario } = resp.data
                const authority = [usuario.rol || 'USER']
                const user = {
                    userName: usuario.nombre,
                    email: usuario.email,
                    authority: authority,
                    avatar: usuario.img || '',
                    credits: usuario.creditos ?? 0,
                }
                dispatch(setUser(user))
                localStorage.setItem(
                    LOCAL_STORAGE_USER_KEY,
                    JSON.stringify(user),
                )
            }
        } catch (error) {
            console.error('Error fetching user profile', error)
        }
    }

    const updateCredits = async () => {
        try {
            const { apiGetUserProfile } = await import('@/services/UserService')
            const resp = await apiGetUserProfile()
            if (resp.data?.ok && resp.data.usuario) {
                const creditsValue = resp.data.usuario.creditos ?? 0
                dispatch(setCredits(creditsValue))

                const storedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY)
                if (storedUser) {
                    const user = JSON.parse(storedUser)
                    user.credits = creditsValue
                    user.creditos = creditsValue
                    localStorage.setItem(
                        LOCAL_STORAGE_USER_KEY,
                        JSON.stringify(user),
                    )
                }
            }
        } catch (error) {
            console.error('Error refreshing credits', error)
        }
    }

    return {
        authenticated: token && signedIn,
        signIn,
        signUp,
        signOut,
        getProfile,
        updateCredits,
    }
}

export default useAuth
