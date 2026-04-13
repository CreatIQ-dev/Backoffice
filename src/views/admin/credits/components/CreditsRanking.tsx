import { useState } from 'react'
import { Table, Card, Spinner } from '@/components/ui'
import dayjs from 'dayjs'
import UserCreditsDetail from './UserCreditsDetail'

const { THead, TBody, Tr, Th, Td } = Table

const CreditsRanking = ({ ranking, loading }: any) => {
    const [selectedUser, setSelectedUser] = useState<string | null>(null)
    const [drawerOpen, setDrawerOpen] = useState(false)

    const handleOpenUserDetail = (userId: string) => {
        setSelectedUser(userId)
        setDrawerOpen(true)
    }

    return (
        <>
            <Card className="glass-card border-none h-full" bodyClass="p-0 overflow-hidden" header={
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
                <h4 className="text-white text-sm font-black uppercase">Top Users Consumption</h4>
            </div>
        }>
            <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                <Table>
                    <THead className="bg-white/5 backdrop-blur-sm sticky top-0 z-10">
                        <Tr className="border-b border-white/10">
                            <Th className="text-xs uppercase font-bold text-muted-foreground !py-3">User</Th>
                            <Th className="text-xs uppercase font-bold text-muted-foreground text-right !py-3">Credits</Th>
                            <Th className="text-xs uppercase font-bold text-muted-foreground text-center !py-3">Runs</Th>
                        </Tr>
                    </THead>
                    <TBody>
                        {loading && ranking.length === 0 ? (
                            <Tr>
                                <Td colSpan={3} className="text-center py-10 opacity-50">
                                    <Spinner className="mx-auto mb-2" />
                                    <p className="text-xs">Loading ranking...</p>
                                </Td>
                            </Tr>
                        ) : ranking.length === 0 ? (
                            <Tr>
                                <Td colSpan={3} className="text-center py-10 opacity-50">
                                    No data found.
                                </Td>
                            </Tr>
                        ) : (
                            ranking.map((row: any, i: number) => (
                                <Tr 
                                    key={row._id} 
                                    className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 group cursor-pointer"
                                    onClick={() => handleOpenUserDetail(row._id)}
                                >
                                    <Td className="!py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                                                {row.user.nombre?.substring(0, 1).toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-white/90 group-hover:text-indigo-400 transition-colors">
                                                    {row.user.nombre}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground">
                                                    last: {dayjs(row.lastRunDate).format('MMM DD')}
                                                </span>
                                            </div>
                                        </div>
                                    </Td>
                                    <Td className="text-right !py-3 font-mono font-bold text-emerald-400">
                                        {row.totalCreditsConsumed?.toLocaleString()}
                                    </Td>
                                    <Td className="text-center !py-3">
                                        <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-bold text-white/60">
                                            {row.runsCount}
                                        </span>
                                    </Td>
                                </Tr>
                            ))
                        )}
                    </TBody>
                </Table>
            </div>
            </Card>

            <UserCreditsDetail 
                userId={selectedUser} 
                isOpen={drawerOpen} 
                onClose={() => setDrawerOpen(false)} 
            />
        </>
    )
}

export default CreditsRanking
