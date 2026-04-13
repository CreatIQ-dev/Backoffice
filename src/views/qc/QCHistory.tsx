import { useState, useEffect, useCallback, useRef } from 'react'
import {
    Card,
    Table,
    Tag,
    Button,
    Dialog,
    Select,
    DatePicker,
    Tooltip,
    Progress,
    Pagination,
    Dropdown,
} from '@/components/ui'
import {
    apiGetQCHistory,
    QCRun,
    QCFinding,
    apiGetPlatforms,
    QCMetrics,
    QCHistoryParams,
} from '@/services/QCService'
import dayjs from 'dayjs'
import {
    HiOutlineVideoCamera,
    HiOutlineCheckCircle,
    HiOutlineExclamationTriangle,
    HiOutlinePresentationChartBar,
    HiOutlineEye,
    HiOutlineInformationCircle,
    HiOutlineExclamationCircle,
    HiOutlineGlobeAlt,
    HiOutlineChartBar,
    HiOutlineAdjustmentsHorizontal,
    HiOutlineCalendar,
    HiArrowPath,
} from 'react-icons/hi2'
import { useAppSelector } from '@/store'
import appConfig from '@/configs/app.config'

const { THead, TBody, Tr, Th, Td } = Table

const QCDetailModal = ({
    run,
    isOpen,
    onClose,
}: {
    run: QCRun | null
    isOpen: boolean
    onClose: () => void
}) => {
    if (!run) return null

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const getSeverityColor = (severity: QCFinding['severity']) => {
        switch (severity) {
            case 'error':
                return 'bg-red-500/10 text-red-500 border-red-500/20'
            case 'warning':
                return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
            case 'info':
                return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
            default:
                return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
        }
    }

    const ValidationStatus = ({
        label,
        checked,
        result,
    }: {
        label: string
        checked: boolean
        result: JSX.Element | string
    }) => (
        <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-none">
            <span className="text-xs text-white/60 font-medium lowercase tracking-wider">
                {label}
            </span>
            {checked ? (
                <div className="flex items-center gap-1.5 font-bold text-[10px] uppercase">
                    {result}
                </div>
            ) : (
                <Tag className="bg-white/5 text-white/30 border-none text-[9px] font-black uppercase tracking-tighter">
                    Not included
                </Tag>
            )}
        </div>
    )

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            onRequestClose={onClose}
            width={750}
            contentClassName="glass-card border-none bg-slate-900/95"
        >
            <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-4 max-w-[80%]">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center text-2xl shadow-lg shadow-primary/10">
                            <HiOutlineVideoCamera />
                        </div>
                        <div className="overflow-hidden">
                            <h3
                                className="text-white font-bold leading-tight truncate text-xl"
                                title={run.fileName}
                            >
                                {run.fileName}
                            </h3>
                            <p className="text-muted-foreground text-xs font-semibold mt-0.5 opacity-60">
                                {dayjs(run.createdAt).format(
                                    'MMMM DD, YYYY · HH:mm',
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                            <HiOutlineInformationCircle />
                            Asset Technical Info
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/5 rounded-xl p-3 border border-white/10 group hover:bg-white/10 transition-colors">
                                <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-tight mb-1">
                                    Resolution
                                </span>
                                <p className="text-white text-sm font-bold">
                                    {run.metadata.width} x {run.metadata.height}
                                </p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-3 border border-white/10 group hover:bg-white/10 transition-colors">
                                <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-tight mb-1">
                                    Format / FPS
                                </span>
                                <p className="text-white text-sm font-bold truncate">
                                    {run.metadata.format.toUpperCase()} ·{' '}
                                    {run.metadata.fps}
                                </p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-3 border border-white/10 group hover:bg-white/10 transition-colors col-span-2 flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-tight mb-0.5">
                                        Duration
                                    </span>
                                    <p className="text-white text-sm font-bold">
                                        {formatDuration(run.metadata.duration)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-tight mb-0.5">
                                        Platform
                                    </span>
                                    <Tag className="bg-indigo-500/20 text-indigo-400 border-none font-black text-[9px] tracking-widest">
                                        {run.platform}
                                    </Tag>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                            <HiOutlineCheckCircle />
                            Validation Summary
                        </h4>
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/10 flex flex-col gap-1 shadow-sm">
                            <ValidationStatus
                                label="Platform Fit"
                                checked={run.summary.platform_fit.checked}
                                result={
                                    run.summary.platform_fit.failed > 0 ? (
                                        <span className="text-red-500">
                                            {run.summary.platform_fit.failed}{' '}
                                            Failed
                                        </span>
                                    ) : (
                                        <span className="text-emerald-500">
                                            All Passed
                                        </span>
                                    )
                                }
                            />
                            <ValidationStatus
                                label="Safe Zones"
                                checked={run.summary.safe_zone.checked}
                                result={
                                    run.summary.safe_zone.status === 'fail' ? (
                                        <span className="text-amber-500">
                                            {run.summary.safe_zone.count} Issues
                                        </span>
                                    ) : (
                                        <span className="text-emerald-500">
                                            Perfect Fit
                                        </span>
                                    )
                                }
                            />
                            <ValidationStatus
                                label="Typos & Spelling"
                                checked={run.summary.typos.checked}
                                result={
                                    run.summary.typos.count > 0 ? (
                                        <span className="text-amber-500">
                                            {run.summary.typos.count} Found
                                        </span>
                                    ) : (
                                        <span className="text-emerald-500">
                                            No issues
                                        </span>
                                    )
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-2">
                    <h4 className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2 mb-4">
                        <HiOutlineExclamationTriangle />
                        Detailed Findings & Tips
                    </h4>
                    <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-3 custom-scrollbar">
                        {run.findings.length === 0 ? (
                            <div className="text-center py-8 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                                <HiOutlineCheckCircle className="text-4xl text-emerald-500 mx-auto mb-2" />
                                <p className="text-emerald-400 font-medium">
                                    No issues found. Perfect fit!
                                </p>
                            </div>
                        ) : (
                            run.findings.map((finding, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white/5 rounded-2xl p-5 border border-white/10 group hover:border-white/20 transition-all"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <Tag
                                                className={`uppercase text-[9px] font-black tracking-tighter border ${getSeverityColor(finding.severity)}`}
                                            >
                                                {finding.severity}
                                            </Tag>
                                            <h5 className="text-white font-bold text-sm">
                                                {finding.title}
                                            </h5>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground/60 font-mono uppercase">
                                            Code: {finding.type}
                                        </span>
                                    </div>
                                    <p className="text-white/70 text-sm leading-relaxed mb-4">
                                        {finding.description}
                                    </p>
                                    {finding.recommendation && (
                                        <div className="bg-secondary/30 rounded-xl p-3 border border-secondary/20 flex gap-3">
                                            <div className="mt-1 text-primary text-lg">
                                                💡
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">
                                                    Recommendation
                                                </p>
                                                <p className="text-xs text-white/90 leading-tight italic">
                                                    {finding.recommendation}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

const POLL_INTERVAL_MS = 30_000

const QCHistory = () => {
    const accessToken = useAppSelector((state) => state.auth.session.token)
    const [runs, setRuns] = useState<QCRun[]>([])
    const [metrics, setMetrics] = useState<QCMetrics | null>(null)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false) // silent refresh flag
    const [selectedRun, setSelectedRun] = useState<QCRun | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date())
    const [liveActive, setLiveActive] = useState(false) // pulse indicator
    const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const [datePreset, setDatePreset] = useState('Last 30 days')
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
        dayjs().subtract(30, 'days').startOf('day').toDate(),
        dayjs().endOf('day').toDate(),
    ])
    const [outcome, setOutcome] = useState('All')
    const [platform, setPlatform] = useState('All')

    const [platformOptions, setPlatformOptions] = useState<
        { value: string; label: string }[]
    >([{ value: 'All', label: 'All Platforms' }])

    const outcomeOptions = [
        { value: 'All', label: 'All Outcomes' },
        { value: 'Passed', label: 'Passed Only' },
        { value: 'Failed', label: 'Failed Only' },
    ]

    const presets = [
        {
            label: 'Today',
            getValue: () => [
                dayjs().startOf('day').toDate(),
                dayjs().endOf('day').toDate(),
            ],
        },
        {
            label: 'This week',
            getValue: () => [
                dayjs().startOf('week').toDate(),
                dayjs().endOf('week').toDate(),
            ],
        },
        {
            label: 'This month',
            getValue: () => [
                dayjs().startOf('month').toDate(),
                dayjs().endOf('month').toDate(),
            ],
        },
        {
            label: 'Last 30 days',
            getValue: () => [
                dayjs().subtract(30, 'days').startOf('day').toDate(),
                dayjs().endOf('day').toDate(),
            ],
        },
    ]

    useEffect(() => {
        const fetchPlatforms = async () => {
            try {
                const resp = await apiGetPlatforms()
                if (resp.data.ok) {
                    const opts = [
                        { value: 'All', label: 'All Platforms' },
                        ...resp.data.digital.map((p) => ({
                            value: p.key,
                            label: p.name,
                        })),
                        ...resp.data.broadcast.map((p) => ({
                            value: p.key,
                            label: p.name,
                        })),
                    ]
                    setPlatformOptions(opts)
                }
            } catch (err) {}
        }
        fetchPlatforms()
    }, [])

    const fetchHistory = useCallback(
        async (silent = false) => {
            if (silent) {
                setRefreshing(true)
            } else {
                setLoading(true)
            }
            try {
                const params: QCHistoryParams = {
                    page,
                    limit: 10,
                    outcome,
                    platform,
                }
                if (dateRange[0] && dateRange[1]) {
                    params.date_from = dateRange[0].toISOString()
                    params.date_to = dateRange[1].toISOString()
                }

                const resp = await apiGetQCHistory(params)
                if (resp.data && resp.data.ok) {
                    setRuns(resp.data.runs)
                    setTotalPages(resp.data.totalPages)
                    if (resp.data.metrics) {
                        setMetrics(resp.data.metrics)
                    }
                    setLastRefreshed(new Date())
                }
            } catch (error) {
                console.error('Error fetching QC history', error)
            } finally {
                setLoading(false)
                setRefreshing(false)
            }
        },
        [page, dateRange, outcome, platform],
    )

    useEffect(() => {
        fetchHistory()
    }, [fetchHistory])

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'CREATIQ_QC_COMPLETED') {
                console.log(
                    'CreatIQ Dashboard: QC run detected – refreshing...',
                )
                setLiveActive(true)
                setTimeout(() => setLiveActive(false), 3000)
                setPage(1)
                fetchHistory(true)
            }
        }
        window.addEventListener('message', handleMessage)
        return () => window.removeEventListener('message', handleMessage)
    }, [fetchHistory])

    useEffect(() => {
        pollTimerRef.current = setInterval(() => {
            fetchHistory(true)
        }, POLL_INTERVAL_MS)
        return () => {
            if (pollTimerRef.current) clearInterval(pollTimerRef.current)
        }
    }, [fetchHistory])

    useEffect(() => {
        if (!accessToken) return

        const baseURL =
            (import.meta.env.VITE_API_BASE_URL || '') + appConfig.apiPrefix
        const sseUrl = `${baseURL}/qc/stream?token=${accessToken}`
        const eventSource = new EventSource(sseUrl)

        eventSource.addEventListener('qc_completed', (event: MessageEvent) => {
            console.log(
                'CreatIQ Dashboard: SSE QC run detected – refreshing...',
            )
            setLiveActive(true)
            setTimeout(() => setLiveActive(false), 3000)
            setPage(1)
            fetchHistory(true)
        })

        return () => {
            eventSource.close()
        }
    }, [accessToken, fetchHistory])

    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === 'visible') {
                fetchHistory(true)
            }
        }
        document.addEventListener('visibilitychange', handleVisibility)
        return () =>
            document.removeEventListener('visibilitychange', handleVisibility)
    }, [fetchHistory])

    const handleDateRangeChange = (dates: [Date | null, Date | null]) => {
        setDateRange(dates)
        setDatePreset('Custom')
        setPage(1)
    }

    const handlePresetClick = (presetInfo: any) => {
        setDatePreset(presetInfo.label)
        setDateRange(presetInfo.getValue() as [Date, Date])
        setPage(1)
    }

    const handleViewDetail = (run: QCRun) => {
        setSelectedRun(run)
        setIsModalOpen(true)
    }

    return (
        <div className="flex flex-col gap-6 md:p-6 animate-fade-in relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div>
                        <h2 className="mb-1 text-white text-3xl font-bold tracking-tight">
                            QC Run History
                        </h2>
                        <div className="flex items-center gap-3">
                            <p className="text-muted-foreground font-light max-w-xl">
                                Monitor technical compliance and performance
                                metrics.
                            </p>
                            <div
                                className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-500 ${
                                    liveActive
                                        ? 'text-emerald-400 opacity-100'
                                        : 'text-white/20 opacity-60'
                                }`}
                            >
                                <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                        liveActive
                                            ? 'bg-emerald-400 animate-ping'
                                            : 'bg-white/20'
                                    }`}
                                />
                                {liveActive
                                    ? 'Updated!'
                                    : `Live · ${dayjs(lastRefreshed).format('HH:mm:ss')}`}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        shape="circle"
                        size="md"
                        variant="twoTone"
                        icon={
                            <HiArrowPath
                                className={refreshing ? 'animate-spin' : ''}
                            />
                        }
                        onClick={() => fetchHistory(true)}
                        title="Refresh now"
                    />

                    <Dropdown
                        renderTitle={
                            <Button
                                shape="circle"
                                size="md"
                                variant="twoTone"
                                icon={<HiOutlineAdjustmentsHorizontal />}
                            />
                        }
                        placement="bottom-end"
                    >
                        <div className="p-4 w-[420px] bg-[#1e1e2d] border border-white/10 rounded-xl shadow-2xl flex flex-col gap-4">
                            <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <HiOutlineCalendar className="text-lg" />{' '}
                                    Date Range
                                </p>
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {presets.map((p) => (
                                        <button
                                            key={p.label}
                                            onClick={() => handlePresetClick(p)}
                                            className={`text-[9px] px-2 py-1 rounded-md font-bold uppercase transition-all ${datePreset === p.label ? 'bg-primary text-white' : 'bg-white/5 text-muted-foreground hover:bg-white/10'}`}
                                        >
                                            {p.label}
                                        </button>
                                    ))}
                                </div>
                                <DatePicker.DatePickerRange
                                    value={dateRange}
                                    onChange={handleDateRangeChange}
                                    size="sm"
                                    placeholder="Select range"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                                        Outcome
                                    </p>
                                    <Select
                                        size="sm"
                                        options={outcomeOptions}
                                        value={outcomeOptions.find(
                                            (o) => o.value === outcome,
                                        )}
                                        onChange={(val: any) => {
                                            setOutcome(val.value)
                                            setPage(1)
                                        }}
                                    />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                                        Platform
                                    </p>
                                    <Select
                                        size="sm"
                                        options={platformOptions}
                                        value={platformOptions.find(
                                            (o) => o.value === platform,
                                        )}
                                        onChange={(val: any) => {
                                            setPlatform(val.value)
                                            setPage(1)
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Dropdown>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="glass-card border-none bg-white/5 p-2 transition-all hover:bg-white/10 flex items-center gap-4">
                    <div className="flex flex-row items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-2xl flex-shrink-0">
                            <HiOutlinePresentationChartBar />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                                Total Runs
                            </p>
                            <h3 className="text-white text-3xl font-black leading-tight tracking-tight">
                                {metrics?.totalRuns ?? 0}
                            </h3>
                        </div>
                    </div>
                </Card>

                <Card className="glass-card border-none bg-white/5 p-2 transition-all hover:bg-white/10 flex items-center gap-4">
                    <div className="flex flex-row items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-2xl flex-shrink-0">
                            <HiOutlineCheckCircle />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                                Pass Rate
                            </p>
                            <h3 className="text-white text-3xl font-black leading-tight tracking-tight">
                                {metrics?.passRate ?? 0}%
                            </h3>
                        </div>
                    </div>
                </Card>

                <Card className="glass-card border-none bg-white/5 p-2 transition-all hover:bg-white/10 flex items-center gap-4">
                    <div className="flex flex-row items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-2xl flex-shrink-0">
                            <HiOutlineExclamationCircle />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                                Common Error
                            </p>
                            <h3
                                className="text-white text-xl font-bold leading-tight truncate"
                                title={metrics?.mostCommonError}
                            >
                                {metrics?.mostCommonError || 'N/A'}
                            </h3>
                        </div>
                    </div>
                </Card>

                <Card className="glass-card border-none bg-white/5 p-2 transition-all hover:bg-white/10 flex items-center gap-4">
                    <div className="flex flex-row items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center text-2xl flex-shrink-0">
                            <HiOutlineGlobeAlt />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                                Top Failed
                            </p>
                            <h3
                                className="text-white text-xl font-bold leading-tight truncate"
                                title={metrics?.mostFailedPlatform}
                            >
                                {metrics?.mostFailedPlatform || 'N/A'}
                            </h3>
                        </div>
                    </div>
                </Card>
            </div>

            <Card
                className="glass-card border-none overflow-hidden"
                bodyClass="p-0"
            >
                <div className="overflow-x-auto">
                    <Table>
                        <THead className="bg-white/5 border-b border-white/10">
                            <Tr>
                                <Th className="text-white/40 uppercase text-[10px] font-black tracking-widest py-4">
                                    File Name
                                </Th>
                                <Th className="text-white/40 uppercase text-[10px] font-black tracking-widest py-4">
                                    Platform
                                </Th>
                                <Th className="text-white/40 uppercase text-[10px] font-black tracking-widest py-4">
                                    Resolution
                                </Th>
                                <Th className="text-white/40 uppercase text-[10px] font-black tracking-widest py-4">
                                    Date
                                </Th>
                                <Th className="text-white/40 uppercase text-[10px] font-black tracking-widest py-4 text-center">
                                    Outcome
                                </Th>
                                <Th className="text-white/40 uppercase text-[10px] font-black tracking-widest py-4 text-right">
                                    Action
                                </Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {loading ? (
                                <Tr>
                                    <Td
                                        colSpan={6}
                                        className="text-center py-20"
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                            <span className="text-muted-foreground animate-pulse">
                                                Synchronizing history...
                                            </span>
                                        </div>
                                    </Td>
                                </Tr>
                            ) : runs.length === 0 ? (
                                <Tr>
                                    <Td
                                        colSpan={6}
                                        className="text-center py-20"
                                    >
                                        <p className="text-muted-foreground">
                                            No recent activity detected.
                                        </p>
                                    </Td>
                                </Tr>
                            ) : (
                                runs.map((run) => (
                                    <Tr
                                        key={run._id}
                                        className="hover:bg-white/5 border-b border-white/5 last:border-none transition-all group"
                                    >
                                        <Td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-secondary/30 text-primary flex items-center justify-center text-xl group-hover:bg-primary group-hover:text-white transition-all transform group-hover:scale-105">
                                                    <HiOutlineVideoCamera />
                                                </div>
                                                <span
                                                    className="font-bold text-white/90 truncate max-w-[200px]"
                                                    title={run.fileName}
                                                >
                                                    {run.fileName}
                                                </span>
                                            </div>
                                        </Td>
                                        <Td>
                                            <Tag className="bg-white/10 text-white/80 border-none uppercase text-[9px] font-black tracking-widest px-3 py-1">
                                                {run.platform}
                                            </Tag>
                                        </Td>
                                        <Td>
                                            <span className="text-xs font-mono text-white/60">
                                                {run.metadata.width}x
                                                {run.metadata.height}
                                            </span>
                                        </Td>
                                        <Td>
                                            <span className="text-[11px] font-medium text-muted-foreground uppercase">
                                                {dayjs(run.createdAt).format(
                                                    'MMM DD, YYYY',
                                                )}
                                                <br />
                                                <span className="text-[9px] text-white/30">
                                                    {dayjs(
                                                        run.createdAt,
                                                    ).format('HH:mm')}
                                                </span>
                                            </span>
                                        </Td>
                                        <Td>
                                            <div className="flex items-center justify-center gap-3">
                                                {run.summary.platform_fit
                                                    .failed > 0 ? (
                                                    <Tag className="bg-red-500/10 text-red-500 border border-red-500/20 uppercase text-[9px] font-black">
                                                        FAILED
                                                    </Tag>
                                                ) : (
                                                    <Tag className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase text-[9px] font-black">
                                                        PASSED
                                                    </Tag>
                                                )}
                                            </div>
                                        </Td>
                                        <Td className="text-right">
                                            <Button
                                                size="sm"
                                                variant="twoTone"
                                                className="opacity-60 group-hover:opacity-100 transition-all border-none bg-primary/10 hover:bg-primary/20 text-primary"
                                                icon={<HiOutlineEye />}
                                                onClick={() =>
                                                    handleViewDetail(run)
                                                }
                                            >
                                                Full Report
                                            </Button>
                                        </Td>
                                    </Tr>
                                ))
                            )}
                        </TBody>
                    </Table>
                </div>
            </Card>

            {!loading && totalPages > 1 && (
                <div className="flex justify-center mt-2">
                    <Pagination
                        currentPage={page}
                        total={totalPages}
                        onChange={(n) => setPage(n)}
                    />
                </div>
            )}

            {!loading &&
                metrics &&
                metrics.topErrors &&
                metrics.topErrors.length > 0 && (
                    <div className="mt-4 border-t border-white/5 pt-8">
                        <h4 className="text-[12px] font-black text-white/80 uppercase tracking-widest flex items-center gap-2 mb-6">
                            <HiOutlineChartBar className="text-primary text-xl" />
                            Most Frequent Findings
                        </h4>
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 flex flex-col gap-6">
                            {metrics.topErrors.map((err, idx) => (
                                <div
                                    key={idx}
                                    className="flex flex-col gap-2 group"
                                >
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-bold text-white/90 group-hover:text-primary transition-colors">
                                            {err.name}
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <span
                                                className={`text-[9px] font-black uppercase tracking-widest opacity-80 ${err.severity === 'error' ? 'text-red-500' : 'text-amber-500'}`}
                                            >
                                                {err.severity}
                                            </span>
                                            <span className="text-xs text-muted-foreground font-mono bg-white/5 px-2 py-0.5 rounded-md">
                                                {err.count} occurrences
                                            </span>
                                        </div>
                                    </div>
                                    <Progress
                                        percent={err.progress}
                                        showInfo={false}
                                        color={
                                            err.severity === 'error'
                                                ? 'red-500'
                                                : 'amber-500'
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            <QCDetailModal
                run={selectedRun}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    )
}

export default QCHistory
