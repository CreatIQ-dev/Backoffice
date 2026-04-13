import { useState, useEffect } from 'react'
import { Card, Button } from '@/components/ui'
import {
    HiOutlineVideoCamera,
    HiOutlineShieldCheck,
    HiOutlineCpuChip,
    HiOutlineArrowRight,
    HiOutlineLink,
    HiOutlineArrowUpRight,
    HiOutlineArrowDownLeft,
    HiOutlineExclamationCircle,
    HiOutlineBanknotes,
} from 'react-icons/hi2'
import { useAppSelector } from '@/store'
import { apiGetFrameioStatus } from '@/services/AuthService'
import { apiGetTransactions, Transaction } from '@/services/BillingService'
import { apiGetQCHistory, QCRun } from '@/services/QCService'
import {
    apiGetDashboardSummary,
    DashboardStats,
} from '@/services/DashboardService'
import useAuth from '@/utils/hooks/useAuth'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const Home = () => {
    const { getProfile, updateCredits } = useAuth()
    const { userName, tokens, creditos, credits } = useAppSelector(
        (state) => state.auth.user,
    )
    const { token } = useAppSelector((state) => state.auth.session)
    const [frameioConnected, setFrameioConnected] = useState(false)
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [qcRuns, setQcRuns] = useState<QCRun[]>([])
    const [stats, setStats] = useState<DashboardStats>({
        totalChecks: 0,
        assetsMonitored: 0,
        creditsConsumed: 0,
        errorsFound: 0,
    })

    useEffect(() => {
        const checkStatus = async () => {
            try {
                await getProfile()

                const resp = await apiGetFrameioStatus()
                setFrameioConnected(resp.data.ok && !!resp.data.user)
            } catch (error) {
                console.error('Error checking Frame.io status', error)
            }
        }

        const fetchTransactions = async () => {
            try {
                const resp = await apiGetTransactions()
                if (resp.data && resp.data.ok) {
                    setTransactions(resp.data.transactions.slice(0, 5))
                }
            } catch (error) {
                console.error('Error fetching transactions', error)
            }
        }

        const fetchQCHistory = async () => {
            try {
                const resp = await apiGetQCHistory()
                if (resp.data && resp.data.ok) {
                    setQcRuns(resp.data.runs.slice(0, 5))
                }
            } catch (error) {
                console.error('Error fetching QC history', error)
            }
        }

        const fetchStats = async () => {
            try {
                const resp = await apiGetDashboardSummary()
                if (resp.data && resp.data.ok) {
                    setStats(resp.data.stats)
                }
            } catch (error) {
                console.error('Error fetching dashboard stats', error)
            }
        }

        checkStatus()
        fetchTransactions()
        fetchQCHistory()
        fetchStats()

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'user' || e.key === 'auth') {
                updateCredits()
                fetchStats()
            }
        }
        window.addEventListener('storage', handleStorageChange)

        return () => {
            window.removeEventListener('storage', handleStorageChange)
        }
    }, [])

    const handleConnectFrameio = () => {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
        window.open(`${baseUrl}/auth/frameio?token=${token}`, '_blank')
    }

    return (
        <div className="flex flex-col gap-8 md:p-6 animate-fade-in relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="mb-2 text-gradient">
                        Welcome back, {userName || 'User'}
                    </h1>
                    <p className="text-muted-foreground max-w-[600px] font-light">
                        CreatIQ is your command center for video quality
                        control. Monitor automated QC checks from Frame.io and
                        manage training data efficiently.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex flex-col items-end">
                        <span className="text-sm text-muted-foreground uppercase font-bold tracking-tighter">
                            Current Balance
                        </span>
                        <span className="text-xl font-bold text-emerald-500">
                            {(creditos || 0).toLocaleString()}{' '}
                            <span className="text-[12px] text-emerald-500/60 font-medium">
                                CREDITS
                            </span>
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card p-6 flex items-center gap-4 border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all cursor-default">
                    <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/20">
                        <HiOutlineShieldCheck />
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-500">
                            Total Checks
                        </p>
                        <h3 className="font-bold text-white">
                            {(stats.totalChecks || 0).toLocaleString()}
                        </h3>
                    </div>
                </div>

                <div className="glass-card p-6 flex items-center gap-4 border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 transition-all cursor-default">
                    <div className="w-12 h-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-blue-500/20">
                        <HiOutlineVideoCamera />
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-blue-500">
                            Assets Monitored
                        </p>
                        <h3 className="font-bold text-white">
                            {(stats.assetsMonitored || 0).toLocaleString()}
                        </h3>
                    </div>
                </div>

                <div className="glass-card p-6 flex items-center gap-4 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all cursor-default">
                    <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-primary/20">
                        <HiOutlineBanknotes />
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                            Credits Consumed
                        </p>
                        <h3 className="font-bold text-white">
                            {(stats.creditsConsumed || 0).toLocaleString()}
                        </h3>
                    </div>
                </div>

                <div className="glass-card p-6 flex items-center gap-4 border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-all cursor-default">
                    <div className="w-12 h-12 bg-red-500 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-red-500/20">
                        <HiOutlineExclamationCircle />
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-red-500">
                            Errors Found
                        </p>
                        <h3 className="font-bold text-white">
                            {(stats.errorsFound || 0).toLocaleString()}
                        </h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card
                    header={<h4 className="text-white">Recent QC Activity</h4>}
                    className="glass-card border-none"
                    bodyClass="p-6"
                >
                    <div className="flex flex-col gap-4">
                        {qcRuns.length === 0 ? (
                            <p className="text-muted-foreground text-center py-4">
                                No recent QC runs
                            </p>
                        ) : (
                            qcRuns.map((run) => (
                                <div
                                    key={run._id}
                                    className="flex items-center justify-between border-b border-border/50 pb-4 last:border-none last:pb-0 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center group-hover:bg-secondary transition-colors">
                                            <HiOutlineVideoCamera className="text-xl text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-white truncate max-w-[150px]">
                                                {run.fileName}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground uppercase font-semibold">
                                                {dayjs(run.createdAt).fromNow()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {run.summary.platform_fit.failed > 0 ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-500 border border-red-500/20">
                                                FAILED
                                            </span>
                                        ) : run.summary.platform_fit.warnings >
                                          0 ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                                WARNING
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                                PASSED
                                            </span>
                                        )}
                                        <Button
                                            size="xs"
                                            variant="plain"
                                            className="hover:bg-primary/10 p-2 rounded-lg"
                                            icon={<HiOutlineArrowRight />}
                                            onClick={() =>
                                                (window.location.href =
                                                    '/qc-history')
                                            }
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                        <Button
                            block
                            variant="twoTone"
                            size="sm"
                            className="mt-2"
                            onClick={() =>
                                (window.location.href = '/qc-history')
                            }
                        >
                            View All QC History
                        </Button>
                    </div>
                </Card>

                <Card
                    header={<h4 className="text-white">Recent Transactions</h4>}
                    className="glass-card border-none"
                    bodyClass="p-6"
                >
                    <div className="flex flex-col gap-4">
                        {transactions.length === 0 ? (
                            <p className="text-muted-foreground text-center py-4">
                                No recent transactions
                            </p>
                        ) : (
                            transactions.map((tx) => (
                                <div
                                    key={tx._id}
                                    className="flex items-center justify-between border-b border-border/50 pb-4 last:border-none last:pb-0"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${
                                                tx.type === 'CONSUMPTION'
                                                    ? 'bg-red-500/10 text-red-500'
                                                    : 'bg-emerald-500/10 text-emerald-500'
                                            }`}
                                        >
                                            {tx.type === 'CONSUMPTION' ? (
                                                <HiOutlineArrowDownLeft />
                                            ) : (
                                                <HiOutlineArrowUpRight />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">
                                                {tx.description}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground uppercase font-semibold">
                                                {dayjs(tx.createdAt).format(
                                                    'MMM DD, HH:mm',
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p
                                            className={`font-bold ${tx.type === 'CONSUMPTION' || tx.amount < 0 ? 'text-red-400' : 'text-emerald-400'}`}
                                        >
                                            {tx.type === 'CONSUMPTION' ||
                                            tx.amount < 0
                                                ? '-'
                                                : tx.amount > 0
                                                  ? '+'
                                                  : ''}
                                            {Math.abs(
                                                tx.amount,
                                            ).toLocaleString()}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground tracking-tighter uppercase font-bold">
                                            CREDITS
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                        <Button
                            block
                            variant="twoTone"
                            size="sm"
                            className="mt-2"
                            onClick={() => (window.location.href = '/billing')}
                        >
                            View All History
                        </Button>
                    </div>
                </Card>
            </div>

            <div className="text-center text-muted-foreground/40 text-[10px] font-light mt-8 tracking-widest uppercase">
                © {new Date().getFullYear()} CreatIQ Dashboard · Advanced Video
                Logistics
            </div>
        </div>
    )
}

export default Home
