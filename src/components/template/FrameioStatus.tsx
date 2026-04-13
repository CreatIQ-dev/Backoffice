import { useState, useEffect } from 'react'
import { Badge, Button, Tooltip } from '@/components/ui'
import { apiGetFrameioStatus } from '@/services/AuthService'
import { useAppSelector } from '@/store'

const FrameioStatus = () => {
    const [connected, setConnected] = useState<boolean | null>(null)
    const { token } = useAppSelector((state) => state.auth.session)

    const checkStatus = async () => {
        try {
            const resp = await apiGetFrameioStatus()
            setConnected(resp.data.ok && !!resp.data.user)
        } catch (error) {
            setConnected(false)
        }
    }

    useEffect(() => {
        checkStatus()
        const interval = setInterval(checkStatus, 30000)
        return () => clearInterval(interval)
    }, [])

    const handleConnect = () => {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
        window.open(`${baseUrl}/auth/frameio?token=${token}`, '_blank')
    }

    return (
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 border border-border/50">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mr-1">
                Frame.io:
            </span>
            {connected === null ? (
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse" />
            ) : connected ? (
                <Tooltip title="Connected to Frame.io">
                    <div className="flex items-center gap-1.5">
                        <Badge innerClass="bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-bold text-emerald-500">
                            ONLINE
                        </span>
                    </div>
                </Tooltip>
            ) : (
                <div className="flex items-center gap-2">
                    <Tooltip title="Disconnected from Frame.io">
                        <div className="flex items-center gap-1.5">
                            <Badge innerClass="bg-amber-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-amber-500">
                                OFFLINE
                            </span>
                        </div>
                    </Tooltip>
                    <Button
                        size="xs"
                        variant="twoTone"
                        className="h-6 px-2 text-[9px] bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20"
                        onClick={handleConnect}
                    >
                        Connect
                    </Button>
                </div>
            )}
        </div>
    )
}

export default FrameioStatus
