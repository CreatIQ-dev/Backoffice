import ApiService from './ApiService'

export interface DashboardStats {
    totalChecks: number
    assetsMonitored: number
    creditsConsumed: number
    errorsFound: number
}

export interface DashboardSummaryResponse {
    ok: boolean
    stats: DashboardStats
    accounts: any[]
}

export async function apiGetDashboardSummary() {
    return ApiService.fetchData<DashboardSummaryResponse>({
        url: '/api/dashboard/summary',
        method: 'get',
    })
}
