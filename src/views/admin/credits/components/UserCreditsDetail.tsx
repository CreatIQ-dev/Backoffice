import { useState, useEffect } from 'react'
import { Dialog, Spinner, Card, Table } from '@/components/ui'
import { apiGetCreditsUserDetail } from '@/services/AnalyticsService'
import { HiOutlineUser, HiOutlineCurrencyDollar, HiOutlineChartBar, HiOutlineClock } from 'react-icons/hi2'
import { 
    ResponsiveContainer, 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip, 
    CartesianGrid 
} from 'recharts'
import dayjs from 'dayjs'

const { THead, TBody, Tr, Th, Td } = Table

const UserCreditsDetail = ({ userId, isOpen, onClose }: any) => {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isOpen && userId) {
            const fetchData = async () => {
                setLoading(true)
                try {
                    const resp = await apiGetCreditsUserDetail(userId)
                    if (resp.data?.ok) {
                        setData(resp.data)
                    }
                } catch (error) {
                    console.error('Error fetching user detail:', error)
                } finally {
                    setLoading(false)
                }
            }
            fetchData()
        }
    }, [isOpen, userId])

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            onRequestClose={onClose}
            width={800}
            contentClassName="bg-[#0f111a] border border-white/10 rounded-3xl overflow-hidden p-0"
        >
            {loading ? (
                <div className="flex items-center justify-center py-20 text-indigo-400">
                    <Spinner size={40} />
                </div>
            ) : data ? (
                <div className="flex flex-col text-white">
                    {/* Header */}
                    <div className="p-8 bg-gradient-to-br from-indigo-600/20 to-transparent border-b border-white/5">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-3xl bg-indigo-500/20 flex items-center justify-center text-4xl text-indigo-400 border border-indigo-500/30">
                                <HiOutlineUser />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black mb-1">{data.user.nombre}</h2>
                                <p className="text-muted-foreground text-sm">{data.user.email}</p>
                                <div className="flex items-center gap-4 mt-3">
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                                        <HiOutlineCurrencyDollar />
                                        {data.user.creditosActuales} Credits Available
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
                                        <HiOutlineChartBar />
                                        {data.stats.totalRuns} Total Runs
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* History Chart */}
                        <div>
                            <h4 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4">Monthly Consumption</h4>
                            <div className="h-[250px] w-full bg-white/5 rounded-2xl p-4 border border-white/5">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={[...data.history].reverse()}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                                        <XAxis 
                                            dataKey="_id" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{fill: '#4b5563', fontSize: 10}}
                                            tickFormatter={(v) => dayjs(v).format('MMM')}
                                        />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 10}} />
                                        <Tooltip 
                                            cursor={{fill: '#ffffff05'}}
                                            content={({ active, payload }: any) => {
                                                if (active && payload && payload.length) {
                                                    return (
                                                        <div className="bg-[#1a1c2e] p-3 rounded-xl border border-white/10 shadow-2xl">
                                                            <p className="text-xs font-bold text-indigo-400">{payload[0].value} Credits</p>
                                                        </div>
                                                    )
                                                }
                                                return null
                                            }}
                                        />
                                        <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* History Table */}
                        <div>
                            <h4 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4">Historical Usage</h4>
                            <div className="max-h-[250px] overflow-y-auto rounded-2xl border border-white/5 bg-white/5">
                                <Table>
                                    <THead className="bg-white/5">
                                        <Tr>
                                            <Th className="!py-2 text-[10px]">Period</Th>
                                            <Th className="!py-2 text-[10px]">Credits</Th>
                                            <Th className="!py-2 text-[10px]">Runs</Th>
                                        </Tr>
                                    </THead>
                                    <TBody>
                                        {data.history.map((h: any) => (
                                            <Tr key={h._id} className="border-b border-white/5 last:border-0 h-10">
                                                <Td className="!py-2 text-xs font-medium">{dayjs(h._id).format('MMMM YYYY')}</Td>
                                                <Td className="!py-2 text-xs font-bold text-indigo-400">{h.total}</Td>
                                                <Td className="!py-2 text-xs text-white/50">{h.count}</Td>
                                            </Tr>
                                        ))}
                                    </TBody>
                                </Table>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 pt-0 flex justify-end">
                        <button 
                            onClick={onClose}
                            className="px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-all border border-white/10"
                        >
                            Close
                        </button>
                    </div>
                </div>
            ) : null}
        </Dialog>
    )
}

export default UserCreditsDetail
