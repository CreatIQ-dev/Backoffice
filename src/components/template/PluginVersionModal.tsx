import { useState, useEffect } from 'react'
import { Dialog, Button } from '@/components/ui'
import { HiOutlineRocketLaunch } from 'react-icons/hi2'
import { HiOutlineDownload } from 'react-icons/hi'

const STORAGE_KEY = 'creatiq_plugin_version'

const PluginVersionModal = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [latestVersion, setLatestVersion] = useState<string | null>(null)

    const normalizeVersion = (v: string | null) => {
        if (!v) return null
        const val = v.toLowerCase().trim()
        if (val === 'latest' || val === 'lastest' || val === 'downloaded')
            return null
        return val.replace(/^v/, '')
    }

    useEffect(() => {
        const checkVersion = async () => {
            const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
            const rawSavedVersion = localStorage.getItem(STORAGE_KEY)
            const savedVersion = normalizeVersion(rawSavedVersion)

            console.log('[PluginVersionModal] Installed version:', savedVersion)

            try {
                const versionUrl = `${baseUrl}/api/extension/version?t=${Date.now()}`
                console.log('[PluginVersionModal] Fetching from:', versionUrl)

                const res = await fetch(versionUrl, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                })

                if (!res.ok) {
                    console.warn('[PluginVersionModal] API error:', res.status)
                    if (!savedVersion) setIsOpen(true)
                    return
                }

                const data = await res.json()
                if (data.ok && data.version) {
                    const latest = normalizeVersion(data.version)
                    console.log(
                        `[PluginVersionModal] Repo: ${latest} | Local: ${savedVersion}`,
                    )

                    const dismissedVersion = sessionStorage.getItem(
                        'creatiq_dismissed_version',
                    )
                    if (dismissedVersion === latest) {
                        console.log(
                            '[PluginVersionModal] Version already dismissed this session:',
                            latest,
                        )
                        return
                    }

                    if (!savedVersion || latest !== savedVersion) {
                        console.log('[PluginVersionModal] Update required!')
                        setLatestVersion(data.version)
                        setIsOpen(true)
                    } else {
                        console.log('[PluginVersionModal] Up to date.')
                    }
                } else if (!savedVersion) {
                    setIsOpen(true)
                }
            } catch (error) {
                console.error('[PluginVersionModal] Check failed:', error)
                if (!savedVersion) setIsOpen(true)
            }
        }

        const timer = setTimeout(checkVersion, 1500)
        return () => clearTimeout(timer)
    }, [])

    const onDownload = () => {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
        const link = document.createElement('a')
        link.href = `${baseUrl}/api/extension/download`
        link.target = '_blank'
        link.click()

        if (latestVersion) {
            sessionStorage.setItem(
                'creatiq_dismissed_version',
                normalizeVersion(latestVersion) || 'unknown',
            )
            localStorage.setItem(STORAGE_KEY, latestVersion)

            import('@/services/UserService').then(
                ({ apiUpdateUserProfile }) => {
                    apiUpdateUserProfile({
                        pluginVersion: latestVersion,
                    }).catch((err) =>
                        console.error(
                            'Failed to sync plugin version to DB:',
                            err,
                        ),
                    )
                },
            )
        }
        setIsOpen(false)
    }

    return (
        <Dialog
            isOpen={isOpen}
            closable={false}
            onClose={() => {}}
            className="max-w-[420px]"
            contentClassName="rounded-3xl glass-card border-indigo-500/30 p-0 overflow-hidden"
        >
            <div className="relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                    <HiOutlineRocketLaunch className="text-[120px] text-indigo-400" />
                </div>

                <div className="p-8">
                    <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20">
                        <HiOutlineRocketLaunch className="text-3xl text-indigo-400" />
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">
                        {latestVersion
                            ? 'New Plugin Version!'
                            : 'Plugin Required'}
                    </h2>

                    {latestVersion ? (
                        <>
                            <p className="text-sm text-muted-foreground mb-1">
                                Version{' '}
                                <span className="font-mono font-bold text-indigo-400">
                                    {latestVersion}
                                </span>{' '}
                                is now available.
                            </p>
                            <p className="text-sm text-muted-foreground mb-6">
                                Please download and reinstall the extension to
                                continue using all features correctly.
                            </p>
                        </>
                    ) : (
                        <p className="text-sm text-muted-foreground mb-6">
                            You need to install the CreatIQ browser extension to
                            use the platform. Click below to download it.
                        </p>
                    )}

                    <div className="space-y-3">
                        <Button
                            block
                            variant="solid"
                            className="bg-indigo-600 hover:bg-indigo-500 rounded-2xl h-12 text-base font-semibold"
                            icon={<HiOutlineDownload />}
                            onClick={onDownload}
                        >
                            Download{latestVersion ? ' & Update' : ' Extension'}
                        </Button>
                        <p className="text-[10px] text-center text-muted-foreground/40 uppercase tracking-widest">
                            This action is required to close this window
                        </p>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default PluginVersionModal
