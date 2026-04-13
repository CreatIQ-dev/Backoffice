import axios from 'axios'
import Swal from 'sweetalert2'
import appConfig from '@/configs/app.config'
import { TOKEN_TYPE, REQUEST_HEADER_AUTH_KEY } from '@/constants/api.constant'
import { PERSIST_STORE_NAME } from '@/constants/app.constant'
import deepParseJson from '@/utils/deepParseJson'
import store, { signOutSuccess } from '../store'
import type { AuthState } from '../store/slices/auth'

const unauthorizedCode = [401]

const BaseService = axios.create({
    timeout: 60000,
    baseURL: (import.meta.env.VITE_API_BASE_URL || '') + appConfig.apiPrefix,
})

BaseService.interceptors.request.use(
    (config) => {
        const rawPersistData = localStorage.getItem(PERSIST_STORE_NAME)
        const persistData = deepParseJson(rawPersistData) as {
            auth: AuthState
        } | null

        let accessToken = persistData?.auth?.session?.token

        if (!accessToken) {
            const { auth } = store.getState()
            accessToken = auth.session.token
        }

        if (accessToken) {
            config.headers[REQUEST_HEADER_AUTH_KEY] =
                `${TOKEN_TYPE}${accessToken}`
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

BaseService.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error

        if (response && unauthorizedCode.includes(response.status)) {
            store.dispatch(signOutSuccess())
        }

        // Handle generic backend errors with Swal
        const errorData = response?.data as { msg?: string } | undefined
        const errorMsg =
            errorData?.msg ||
            error.message ||
            'There was a problem processing the request.'

        // Don't show Swal for unauthorized (handled by signout) or canceled requests
        if (response?.status !== 401 && error.code !== 'ERR_CANCELED') {
            Swal.fire({
                title: 'Error',
                text: errorMsg,
                icon: 'error',
                confirmButtonColor: '#d33',
            })
        }

        return Promise.reject(error)
    },
)

export default BaseService
