import ApiService from './ApiService'

export interface Transaction {
    _id: string
    type: 'CONSUMPTION' | 'RECHARGE' | 'REFUND'
    amount: number
    balanceAfter: number
    description: string
    createdAt: string
    metadata?: {
        assetId?: string
        duration?: number
        checks?: string[]
        formulaUsed?: string
    }
}

export async function apiGetTransactions() {
    return ApiService.fetchData<{
        ok: boolean
        transactions: Transaction[]
        total: number
        page: number
        totalPages: number
    }>({
        url: '/api/billing/history',
        method: 'get',
    })
}
