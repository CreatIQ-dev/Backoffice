import { Card, Spinner, Segment } from '@/components/ui'
import { 
    ResponsiveContainer, 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip 
} from 'recharts'
import dayjs from 'dayjs'

const CreditsGraph = ({ data, loading, granularity, onGranularityChange }: any) => {
    
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass-card shadow-2xl p-4 border border-white/20 backdrop-blur-3xl rounded-2xl">
                    <p className="text-white/60 text-[10px] font-black uppercase mb-1 tracking-wider">{label}</p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                        <span className="text-white font-black text-xl">{payload[0].value.toLocaleString()} <span className="text-[10px] text-white/50 uppercase ml-1">Credits</span></span>
                    </div>
                </div>
            )
        }
        return null
    }

    return (
        <Card className="glass-card border-none h-full relative group" bodyClass="p-4 md:p-8 flex flex-col h-full overflow-hidden" 
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
                    <div>
                        <h4 className="text-white text-sm font-black uppercase">Credit Consumption Trends</h4>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Track platform usage velocity and peaks.</p>
                    </div>
                    
                    <div className="flex items-center bg-white/5 backdrop-blur-md p-1 rounded-xl">
                        {['day', 'week', 'month'].map((g) => (
                            <button
                                key={g}
                                onClick={() => onGranularityChange(g)}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all duration-300 ${
                                    granularity === g 
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                                    : 'text-white/50 hover:text-white/80'
                                }`}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                </div>
            }
        >
            <div className="h-[350px] w-full mt-6 flex-grow">
                {loading && data.length === 0 ? (
                    <div className="h-full flex items-center justify-center opacity-40">
                        <Spinner size={30} />
                    </div>
                ) : data.length === 0 ? (
                    <div className="h-full flex items-center justify-center opacity-40 text-xs italic">
                        No consumption data for this period.
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ bottom: 30 }}>
                            <defs>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                            <XAxis 
                                dataKey="_id" 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                tickFormatter={(val) => {
                                    if (granularity === 'day') return dayjs(val).format('DD MMM')
                                    if (granularity === 'month') return dayjs(val).format('MMM YY')
                                    return val
                                }}
                            />
                            <YAxis 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                                dx={-10}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area 
                                type="monotone" 
                                dataKey="total" 
                                stroke="#6366f1" 
                                strokeWidth={4}
                                fillOpacity={1} 
                                fill="url(#colorTotal)"
                                animationDuration={1500}
                                animationEasing="ease-in-out"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </Card>
    )
}

export default CreditsGraph
