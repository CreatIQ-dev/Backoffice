import ApiService from './ApiService'

export async function apiGetExtensionVersion() {
    return ApiService.fetchData<{
        ok: boolean
        version: string
    }>({
        url: '/api/extension/version',
        method: 'get',
    })
}

export function handleExtensionDownload() {
    const link = document.createElement('a')
    const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
    link.href = `${baseUrl}/api/extension/download`
    link.target = '_blank'
    link.click()
}
