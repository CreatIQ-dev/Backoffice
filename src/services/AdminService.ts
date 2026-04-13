import ApiService from './ApiService'

export interface AdminCreditsSummaryResponse {
    ok: boolean
    summary: {
        totalConsumed: number
        totalRuns: number
        avgPerRun: number
        today: number
        thisWeek: number
        thisMonth: number
    }
}

export interface AdminCreditsRankingResponse {
    ok: boolean
    ranking: Array<{
        _id: string
        user: {
            id: string
            nombre: string
            email: string
        }
        totalCreditsConsumed: number
        runsCount: number
        avgPerRun: number
        lastRunDate: string
    }>
}

export interface AdminCreditsGraphResponse {
    ok: boolean
    graphData: Array<{
        _id: string
        total: number
        count: number
    }>
}

export interface AdminUserDetailResponse {
    ok: boolean
    user: {
        id: string
        nombre: string
        email: string
        creditosActuales: number
    }
    stats: {
        totalConsumed: number
        totalRuns: number
    }
    history: Array<{
        _id: string
        total: number
        count: number
    }>
}

export async function apiGetCreditsSummary(params?: any) {
    return ApiService.fetchData<AdminCreditsSummaryResponse>({
        url: '/admin/credits/summary',
        method: 'get',
        params,
    })
}

export async function apiGetCreditsRanking(params?: any) {
    return ApiService.fetchData<AdminCreditsRankingResponse>({
        url: '/admin/credits/ranking',
        method: 'get',
        params,
    })
}

export async function apiGetCreditsGraph(params?: any) {
    return ApiService.fetchData<AdminCreditsGraphResponse>({
        url: '/admin/credits/history-graph',
        method: 'get',
        params,
    })
}

export async function apiGetCreditsUserDetail(id: string) {
    return ApiService.fetchData<AdminUserDetailResponse>({
        url: `/admin/credits/user/${id}`,
        method: 'get',
    })
}
