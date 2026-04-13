import { useState, useEffect } from 'react'
import { Card, Tag, Spinner } from '@/components/ui'
import { 
    apiGetCreditsSummary, 
    apiGetCreditsRanking, 
    apiGetCreditsGraph 
} from '@/services/AnalyticsService'
import { HiOutlineDatabase, HiOutlineCalendar, HiOutlinePresentationChartBar, HiOutlineTrendingUp } from 'react-icons/hi'
import CreditsSummary from '@/views/admin/credits/components/CreditsSummary'
import CreditsGraph from '@/views/admin/credits/components/CreditsGraph'
import CreditsFilters from '@/views/admin/credits/components/CreditsFilters'

const CreditsAnalytics = () => {
    const [summary, setSummary] = useState<any>(null)
    const [ranking, setRanking] = useState<any[]>([])
    const [graphData, setGraphData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({
        startDate: null,
        endDate: null,
        userId: '',
        checkType: '',
        granularity: 'day'
    })

    const fetchData = async () => {
        setLoading(true)
        try {
            const [summaryRes, graphRes] = await Promise.all([
                apiGetCreditsSummary(filters),
                apiGetCreditsGraph(filters)
            ])

            if (summaryRes.data?.ok) setSummary(summaryRes.data.summary)
            if (graphRes.data?.ok) setGraphData(graphRes.data.graphData)
        } catch (error) {
            console.error('Error fetching admin credit data:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [filters])

    return (
        <div className="flex flex-col gap-6 md:p-6 pb-20 animate-fade-in text-white relative">
            <style dangerouslySetInnerHTML={{ __html: `
                .select__menu, .picker-panel {
                    background-color: #1a1c2e !important;
                    background: #1a1c2e !important;
                    opacity: 1 !important;
                    backdrop-filter: none !important;
                    -webkit-backdrop-filter: none !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.5) !important;
                }
                .select-option {
                    background-color: transparent !important;
                    color: white !important;
                }
                .select-option.focused, .select-option:hover {
                    background-color: rgba(255, 255, 255, 0.05) !important;
                }
            ` }} />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-20">
                <div>
                    <h2 className="mb-1 text-white flex items-center gap-2">
                        <HiOutlinePresentationChartBar className="text-indigo-400" />
                        Analysis of your credits
                    </h2>
                    <p className="text-muted-foreground">
                        Monitoring your aggregate credit consumption by period.
                    </p>
                </div>
                <CreditsFilters filters={filters} onFilterChange={setFilters} />
            </div>

            {loading && !summary ? (
                <div className="flex items-center justify-center py-20">
                    <Spinner size={40} />
                </div>
            ) : (
                <>
                    <CreditsSummary summary={summary} loading={loading} />
                    
                    <div className="w-full">
                        <CreditsGraph 
                            data={graphData} 
                            loading={loading} 
                            granularity={filters.granularity}
                            onGranularityChange={(g: string) => setFilters({...filters, granularity: g})}
                        />
                    </div>
                </>
            )}
        </div>
    )
}

export default CreditsAnalytics
