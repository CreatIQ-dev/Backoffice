import { Card, Spinner } from '@/components/ui'
import { HiOutlineDatabase, HiOutlineCalendar, HiOutlinePresentationChartBar, HiOutlineTrendingUp } from 'react-icons/hi'
import { HiOutlineBolt } from 'react-icons/hi2'

const SummaryCard = ({ title, value, icon, subtitle, color, loading, decimals = 2 }: any) => {
    return (
        <Card className="glass-card border-none overflow-hidden relative" bodyClass="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider mb-1 flex items-center gap-1">
                        {title}
                    </p>
                    <h3 className="text-2xl font-black text-white">
                        {loading ? <Spinner size={20} /> : (Number(value || 0).toLocaleString(undefined, { 
                            minimumFractionDigits: decimals, 
                            maximumFractionDigits: decimals 
                        }))}
                    </h3>
                    <p className="text-xs text-white/50 mt-1">{subtitle}</p>
                </div>
                <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/10`}>
                    {icon}
                </div>
            </div>
            
            {/* Visual background element */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-5 blur-2xl ${color}`} />
        </Card>
    )
}

const CreditsSummary = ({ summary, loading }: any) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <SummaryCard 
                title="Total Consumption" 
                value={summary?.totalConsumed} 
                icon={<HiOutlineDatabase />} 
                subtitle="Period consumption"
                color="bg-indigo-500/20 text-indigo-400"
                loading={loading}
            />
            <SummaryCard 
                title="QC Runs" 
                value={summary?.totalRuns} 
                icon={<HiOutlineBolt />} 
                subtitle="Executions in period"
                color="bg-purple-500/20 text-purple-400"
                loading={loading}
                decimals={0}
            />
            <SummaryCard 
                title="Avg per Run" 
                value={summary?.avgPerRun} 
                icon={<HiOutlineTrendingUp />} 
                subtitle="Credits per asset"
                color="bg-blue-500/20 text-blue-400"
                loading={loading}
                decimals={2}
            />
            <SummaryCard 
                title="Current Month" 
                value={summary?.thisMonth} 
                icon={<HiOutlineCalendar />} 
                subtitle="Last 30 days total"
                color="bg-emerald-500/20 text-emerald-400"
                loading={loading}
            />
        </div>
    )
}

export default CreditsSummary
