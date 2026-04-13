import { useState, useEffect } from 'react'
import { Card, Table } from '@/components/ui'
import { apiGetTransactions, Transaction } from '@/services/BillingService'
import dayjs from 'dayjs'
import { HiOutlineArrowUpRight, HiOutlineArrowDownLeft } from 'react-icons/hi2'

const { THead, TBody, Tr, Th, Td } = Table

const Transactions = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const resp = await apiGetTransactions()
                if (resp.data && resp.data.ok) {
                    setTransactions(resp.data.transactions)
                }
            } catch (error) {
                console.error('Error fetching transactions', error)
            } finally {
                setLoading(false)
            }
        }

        fetchTransactions()
    }, [])

    return (
        <div className="flex flex-col gap-6 md:p-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="mb-1 text-white">Billing & Credits</h2>
                    <p className="text-muted-foreground">
                        Manage your credit balance and view historical usage.
                    </p>
                </div>
            </div>

            <Card className="glass-card border-none" bodyClass="p-0">
                <Table>
                    <THead>
                        <Tr>
                            <Th>Date</Th>
                            <Th>Type</Th>
                            <Th>Description</Th>
                            <Th>Amount</Th>
                            <Th>Balance</Th>
                        </Tr>
                    </THead>
                    <TBody>
                        {loading ? (
                            <Tr>
                                <Td colSpan={5} className="text-center py-10">
                                    Loading transactions...
                                </Td>
                            </Tr>
                        ) : transactions.length === 0 ? (
                            <Tr>
                                <Td colSpan={5} className="text-center py-10">
                                    No transactions found.
                                </Td>
                            </Tr>
                        ) : (
                            transactions.map((tx) => (
                                <Tr
                                    key={tx._id}
                                    className="hover:bg-white/5 transition-colors"
                                >
                                    <Td>
                                        <span className="text-xs font-medium text-muted-foreground uppercase">
                                            {dayjs(tx.createdAt).format(
                                                'MMM DD, YYYY HH:mm',
                                            )}
                                        </span>
                                    </Td>
                                    <Td>
                                        <div className="flex items-center gap-2">
                                            {tx.type === 'CONSUMPTION' ? (
                                                <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center text-lg">
                                                    <HiOutlineArrowDownLeft />
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-lg">
                                                    <HiOutlineArrowUpRight />
                                                </div>
                                            )}
                                            <span className="font-semibold text-white/90 text-xs">
                                                {tx.type}
                                            </span>
                                        </div>
                                    </Td>
                                    <Td>
                                        <span className="text-sm font-light text-white/70">
                                            {tx.description}
                                        </span>
                                    </Td>
                                    <Td>
                                        <span
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
                                        </span>
                                    </Td>
                                    <Td>
                                        <span className="font-medium text-white/80">
                                            {tx.balanceAfter.toLocaleString()}
                                        </span>
                                    </Td>
                                </Tr>
                            ))
                        )}
                    </TBody>
                </Table>
            </Card>
        </div>
    )
}

export default Transactions
