import ApiService from './ApiService'

export interface QCFinding {
    id: string
    type: string
    title: string
    description: string
    severity: 'error' | 'warning' | 'info'
    recommendation?: string
}

export interface QCRun {
    _id: string
    fileId: string
    fileName: string
    platform: string
    metadata: {
        width: number
        height: number
        duration: number
        fps: number
        format: string
    }
    findings: QCFinding[]
    summary: {
        platform_fit: {
            checked: boolean
            passed: number
            failed: number
            warnings: number
        }
        safe_zone: {
            checked: boolean
            status: string
            count: number
        }
        typos: {
            checked: boolean
            count: number
        }
    }
    cost: number
    createdAt: string
}

export interface QCTopError {
    name: string
    count: number
    severity: string
    progress: number
}

export interface QCMetrics {
    totalRuns: number
    passRate: number
    mostCommonError: string
    mostFailedPlatform: string
    topErrors: QCTopError[]
}

export interface QCHistoryParams {
    page?: number
    limit?: number
    date_from?: string
    date_to?: string
    outcome?: string
    platform?: string
}

export async function apiGetQCHistory(params?: QCHistoryParams) {
    return ApiService.fetchData<{
        ok: boolean
        runs: QCRun[]
        total: number
        page: number
        totalPages: number
        metrics: QCMetrics
    }>({
        url: '/api/qc/history',
        method: 'get',
        params
    })
}

export async function apiGetPlatforms() {
    return ApiService.fetchData<{
        ok: boolean
        digital: { key: string; name: string }[]
        broadcast: { key: string; name: string }[]
    }>({
        url: '/api/qc/platforms',
        method: 'get',
    })
}

