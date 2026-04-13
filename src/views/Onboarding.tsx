import React, { useState, useEffect } from 'react'
import { Button, Steps, Notification, toast } from '@/components/ui'
import {
    HiOutlineDownload,
    HiOutlineArrowRight,
    HiOutlineArrowLeft,
    HiOutlineCheck,
    HiOutlineLink,
    HiOutlineRefresh,
    HiOutlineUserCircle,
    HiOutlineFolderOpen,
    HiOutlineTerminal,
    HiOutlineExternalLink,
} from 'react-icons/hi'
import { HiOutlineCommandLine } from 'react-icons/hi2'
import { useNavigate } from 'react-router-dom'
import { apiGetFrameioStatus } from '@/services/AuthService'
import { useAppSelector } from '@/store'
import useAuth from '@/utils/hooks/useAuth'

const { Item } = Steps

/* ─── Design tokens (inline style objects) ────────────────────────────────── */
const tokens = {
    bg: 'hsl(240 30% 6%)',
    card: 'hsl(240 25% 10%)',
    cardGlass: 'hsl(240 25% 15%)', // Solid background instead of glass for safety
    border: 'hsl(240 15% 35%)',
    primary: 'hsl(270 80% 70%)',
    accent: 'hsl(220 90% 60%)',
    muted: '#F3F4F6', // Brighter gray (gray-100)
    mutedBg: 'hsl(240 20% 20%)',
    secondary: 'hsl(240 20% 30%)',
    foreground: '#FFFFFF',
    destructive: 'hsl(0 72% 51%)',
    gradientAccent:
        'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
    gradientText:
        'linear-gradient(135deg, #e9d5ff 0%, #c7d2fe 100%)',
    gradientCard:
        'linear-gradient(135deg, hsl(240 25% 14%) 0%, hsl(260 30% 18%) 50%, hsl(240 25% 14%) 100%)',
    emeraldGrad:
        'linear-gradient(135deg, #10b981 0%, #059669 100%)',
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const SubStep = ({
    num,
    title,
    children,
}: {
    num: number
    title: string
    children: React.ReactNode
}) => (
    <div className="flex gap-4 items-start">
        <div
            className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: tokens.gradientAccent }}
        >
            {num}
        </div>
        <div>
            <p className="font-semibold mb-1 text-sm text-white">{title}</p>
            <div className="text-sm leading-relaxed text-white/80">
                {children}
            </div>
        </div>
    </div>
)

const Code = ({ children }: { children: React.ReactNode }) => (
    <code
        className="rounded px-2 py-0.5 font-mono text-xs"
        style={{ background: tokens.secondary, color: tokens.primary }}
    >
        {children}
    </code>
)

const Info = ({ children }: { children: React.ReactNode }) => (
    <div
        className="flex gap-2 rounded-2xl p-4 text-sm leading-relaxed"
        style={{
            background: 'hsl(220 80% 55% / 0.15)',
            border: `1px solid hsl(220 80% 55% / 0.3)`,
            color: 'hsl(220 90% 85%)',
        }}
    >
        <span className="flex-shrink-0">💡</span>
        <span>{children}</span>
    </div>
)

/* Gradient CTA button */
const GradientBtn = ({
    onClick,
    children,
    icon,
    disabled,
    loading,
    secondary,
}: {
    onClick?: () => void
    children: React.ReactNode
    icon?: React.ReactNode
    disabled?: boolean
    loading?: boolean
    secondary?: boolean
}) => (
    <button
        onClick={onClick}
        disabled={disabled || loading}
        className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl font-light text-white text-sm transition-all duration-300"
        style={{
            background: disabled
                ? 'rgba(255, 255, 255, 0.05)'
                : secondary
                  ? tokens.emeraldGrad
                  : tokens.gradientAccent,
            color: disabled ? 'rgba(255, 255, 255, 0.3)' : 'white',
            cursor: disabled ? 'not-allowed' : 'pointer',
            boxShadow: disabled ? 'none' : '0 10px 25px -5px rgba(168, 85, 247, 0.4)',
            transform: 'scale(1)',
            letterSpacing: '0.02em',
            border: disabled ? '1px solid rgba(255,255,255,0.1)' : 'none'
        }}
    >
        {loading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : icon ? (
            <span className="text-xl">{icon}</span>
        ) : null}
        <span className="font-semibold">{children}</span>
    </button>
)

/* Ghost button */
const GhostBtn = ({
    onClick,
    children,
    icon,
}: {
    onClick?: () => void
    children: React.ReactNode
    icon?: React.ReactNode
}) => (
    <button
        onClick={onClick}
        className="flex items-center gap-2 py-2.5 px-4 rounded-2xl text-sm font-medium transition-all duration-200 text-white/60 hover:text-white"
        style={{ background: 'transparent' }}
    >
        {icon && <span className="text-lg">{icon}</span>}
        {children}
    </button>
)

/* ─── Main Component ──────────────────────────────────────────────────────── */
const Onboarding = () => {
    const { token } = useAppSelector((state) => state.auth.session)
    const { getProfile } = useAuth()
    const [step, setStep] = useState(0)
    const [browser, setBrowser] = useState<'chrome' | 'safari' | 'edge' | null>(
        null,
    )
    const [installSubStep, setInstallSubStep] = useState(0)
    const [isConnected, setIsConnected] = useState(false)
    const [frameioUser, setFrameioUser] = useState<{
        name: string
        email: string
    } | null>(null)
    const [isChecking, setIsChecking] = useState(false)
    const navigate = useNavigate()


    const onChange = (nextStep: number) => {
        if (nextStep < 0 || nextStep > 3) return
        setStep(nextStep)
        setInstallSubStep(0)
    }
    const onNext = () => onChange(step + 1)
    const onPrev = () => onChange(step - 1)

    const handleDownload = async () => {
        const link = document.createElement('a')
        const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
        link.href = `${baseUrl}/api/extension/download`
        link.target = '_blank'
        link.click()

        // Set the version in localStorage so the update modal doesn't show right away
        try {
            const res = await fetch(`${baseUrl}/api/extension/version`)
            const data = await res.json()
            if (data.ok && data.version) {
                localStorage.setItem('creatiq_plugin_version', data.version)
                const { apiUpdateUserProfile } = await import('@/services/UserService')
                await apiUpdateUserProfile({ pluginVersion: data.version })
            }
        } catch (error) {
            console.error('Failed to set plugin version:', error)
        }
    }

    const checkConnection = async (showToast = true) => {
        setIsChecking(true)
        try {
            const resp = await apiGetFrameioStatus()
            if (resp.data.ok && resp.data.user) {
                setIsConnected(true)
                setFrameioUser(resp.data.user)
                if (showToast)
                    toast.push(
                        <Notification title="Authorized" type="success">
                            Frame.io account linked: {resp.data.user.name}
                        </Notification>,
                        { placement: 'top-center' },
                    )
            } else {
                setIsConnected(false)
                setFrameioUser(null)
                if (showToast) {
                    const isExpired = resp.data.status === 'expired'
                    toast.push(
                        <Notification
                            title={isExpired ? 'Session Expired' : 'Not Linked'}
                            type={isExpired ? 'danger' : 'warning'}
                        >
                            {isExpired
                                ? 'Your token has expired. Please authorize again.'
                                : "We couldn't find an active Frame.io session."}
                        </Notification>,
                        { placement: 'top-center' },
                    )
                }
            }
        } catch {
            if (showToast)
                toast.push(
                    <Notification title="Connection Error" type="danger">
                        Backend server is unreachable. Please check port 5001.
                    </Notification>,
                    { placement: 'top-center' },
                )
        } finally {
            setIsChecking(false)
        }
    }

    const handleConnectFrameio = () => {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
        window.open(`${baseUrl}/auth/frameio?token=${token}`, '_blank')
    }

    const handleComplete = async () => {
        const { apiUpdateUserProfile } = await import('@/services/UserService')
        
        try {
            await apiUpdateUserProfile({ onboardingSeen: true })
            await getProfile()
        } catch (error) {
            console.error('Failed to update onboarding status:', error)
        }

        // Ensure the version is set so the update modal doesn't show up on first login
        const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
        if (!localStorage.getItem('creatiq_plugin_version')) {
            try {
                const res = await fetch(`${baseUrl}/api/extension/version`)
                const data = await res.json()
                if (data.ok && data.version) {
                    localStorage.setItem('creatiq_plugin_version', data.version)
                    const { apiUpdateUserProfile } = await import('@/services/UserService')
                    await apiUpdateUserProfile({ pluginVersion: data.version })
                }
            } catch (error) {
                console.error('Failed to set plugin version on complete:', error)
            }
        }

        navigate('/home')
    }

    useEffect(() => {
        if (step === 2) checkConnection(false)
    }, [step])

    /* ── Install sub-steps ─────────────────────────────────────────────────── */
    const chromeSteps = [
        {
            title: 'Download the extension',
            icon: <HiOutlineDownload style={{ strokeWidth: 1 }} />,
            content: (
                <div className="space-y-4">
                    <p style={{ color: tokens.muted }}>
                        Click the button below. A file called{' '}
                        <Code>creatiq-extension.zip</Code> will be downloaded to
                        your computer.
                    </p>
                    <Info>
                        The file is saved to your <strong>Downloads</strong>{' '}
                        folder automatically.
                    </Info>
                    <GradientBtn
                        icon={<HiOutlineDownload />}
                        onClick={handleDownload}
                    >
                        Download Extension
                    </GradientBtn>
                </div>
            ),
        },
        {
            title: 'Unzip the file',
            icon: <HiOutlineFolderOpen style={{ strokeWidth: 1 }} />,
            content: (
                <div className="space-y-4">
                    <p style={{ color: tokens.muted }}>
                        Find <Code>creatiq-extension.zip</Code> in your{' '}
                        <strong>Downloads</strong> folder and extract it:
                    </p>
                    <div className="space-y-3">
                        <SubStep num={1} title="On Windows:">
                            <p>
                                Right-click the file → select{' '}
                                <strong>"Extract on creatiq-extension/"</strong>{' '}
                                → click <strong>"Extract"</strong>.
                            </p>
                        </SubStep>
                        <SubStep num={2} title="On Mac:">
                            <p>
                                Double-click the file. It extracts automatically
                                and a new folder appears.
                            </p>
                        </SubStep>
                    </div>
                    <Info>
                        You'll see a folder named{' '}
                        <strong>creatiq-extension</strong> when done. Keep it
                        somewhere safe — Chrome needs it.
                    </Info>
                </div>
            ),
        },
        {
            title: 'Open the Extensions page',
            icon: <HiOutlineExternalLink style={{ strokeWidth: 1 }} />,
            content: (
                <div className="space-y-4">
                    <p style={{ color: tokens.muted }}>
                        In {browser === 'edge' ? 'Edge' : 'Chrome'}, open a new
                        tab and type this in the address bar:
                    </p>
                    <div
                        className="rounded-2xl px-4 py-3 font-mono text-sm text-center select-all"
                        style={{
                            background: tokens.secondary,
                            color: tokens.primary,
                            border: `1px solid ${tokens.border}`,
                        }}
                    >
                        {browser === 'edge'
                            ? 'edge://extensions/'
                            : 'chrome://extensions/'}
                    </div>
                    <Info>
                        You can also get there from the{' '}
                        {browser === 'edge' ? 'Edge' : 'Chrome'} menu → More
                        Tools → Extensions.
                    </Info>
                </div>
            ),
        },
        {
            title: 'Enable "Developer mode"',
            icon: <HiOutlineTerminal style={{ strokeWidth: 1 }} />,
            content: (
                <div className="space-y-4">
                    <p style={{ color: tokens.muted }}>
                        On the Extensions page, look in the{' '}
                        <strong>top-right corner</strong> for a toggle labeled{' '}
                        <strong>"Developer mode"</strong> and turn it on.
                    </p>
                    <div
                        className="rounded-2xl p-4 text-sm font-mono"
                        style={{
                            background: 'hsl(240 30% 6%)',
                            border: `1px solid ${tokens.border}`,
                        }}
                    >
                        <div className="flex items-center justify-between">
                            <span style={{ color: tokens.muted }}>
                                🧩 Extensions
                            </span>
                            <span
                                className="text-xs px-2 py-1 rounded-full text-white"
                                style={{ background: tokens.gradientAccent }}
                            >
                                Developer mode ●
                            </span>
                        </div>
                    </div>
                    <Info>
                        Once enabled, new buttons will appear at the top of the
                        page.
                    </Info>
                </div>
            ),
        },
        {
            title: 'Load the extension',
            icon: <HiOutlineFolderOpen style={{ strokeWidth: 1 }} />,
            content: (
                <div className="space-y-4">
                    <p style={{ color: tokens.muted }}>
                        Click the{' '}
                        <span
                            style={{ color: tokens.primary, fontWeight: 600 }}
                        >
                            "Load unpacked"
                        </span>{' '}
                        button that appeared after enabling Developer mode.
                    </p>
                    <div className="space-y-3">
                        <SubStep num={1} title="A file browser will open.">
                            <p>
                                Navigate to the <Code>creatiq-extension</Code>{' '}
                                folder you extracted earlier.
                            </p>
                        </SubStep>
                        <SubStep num={2} title="Select the entire folder.">
                            <p>
                                Click once on the folder to select it (don't
                                open it), then click{' '}
                                <strong>"Select Folder"</strong>.
                            </p>
                        </SubStep>
                        <SubStep num={3} title="Done! 🎉">
                            <p>
                                <strong>CreatIQ</strong> will appear in your
                                installed extensions list.
                            </p>
                        </SubStep>
                    </div>
                </div>
            ),
        },
    ]

    const safariSteps = [
        {
            title: 'Download the extension',
            icon: <HiOutlineDownload style={{ strokeWidth: 1 }} />,
            content: (
                <div className="space-y-4">
                    <p style={{ color: tokens.muted }}>
                        Click the button below to download the extension for
                        Safari.
                    </p>
                    <GradientBtn
                        icon={<HiOutlineDownload />}
                        onClick={handleDownload}
                    >
                        Download Extension for Safari
                    </GradientBtn>
                    <Info>Saved automatically to your Downloads folder.</Info>
                </div>
            ),
        },
        {
            title: 'Open the file',
            icon: <HiOutlineFolderOpen style={{ strokeWidth: 1 }} />,
            content: (
                <div className="space-y-4">
                    <p style={{ color: tokens.muted }}>
                        Double-click the <Code>.zip</Code> file to extract it.
                    </p>
                    <SubStep num={1} title="A new folder is created.">
                        <p>Open that folder and find the CreatIQ app.</p>
                    </SubStep>
                    <SubStep num={2} title="Drag the app to Applications.">
                        <p>
                            Drag <Code>CreatIQ.app</Code> into your{' '}
                            <strong>Applications</strong> folder.
                        </p>
                    </SubStep>
                </div>
            ),
        },
        {
            title: 'Enable the extension in Safari',
            icon: <HiOutlineTerminal style={{ strokeWidth: 1 }} />,
            content: (
                <div className="space-y-4">
                    <SubStep
                        num={1}
                        title="Open the CreatIQ app from Applications."
                    >
                        <p>
                            Double-click it and follow any on-screen
                            instructions.
                        </p>
                    </SubStep>
                    <SubStep num={2} title="Open Safari → Settings.">
                        <p>
                            From the menu bar → <strong>Safari</strong> →{' '}
                            <strong>Settings</strong>.
                        </p>
                    </SubStep>
                    <SubStep num={3} title="Go to the Extensions tab.">
                        <p>
                            Find <strong>CreatIQ</strong> and toggle it to{' '}
                            <strong>On</strong>.
                        </p>
                    </SubStep>
                </div>
            ),
        },
    ]

    const installSteps = browser === 'safari' ? safariSteps : chromeSteps
    const totalInstallSteps = installSteps.length
    const currentInstallStep = installSteps[installSubStep]

    /* ── Render ────────────────────────────────────────────────────────────── */
    return (
        <>
            <div className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10">
                <div className="relative z-10 w-full max-w-2xl">
                    {/* ── Logo ── */}
                    <div className="flex justify-center mb-10">
                        <img
                            src="/img/logo/LogoShadow.png"
                            alt="CreatIQ"
                            className="h-10 object-contain brightness-125"
                        />
                    </div>

                    {/* ── Heading ── */}
                    <div className="text-center mb-10">
                        <h1
                            className="text-3xl font-semibold gradient-text mb-2"
                            style={{ letterSpacing: '-0.025em' }}
                        >
                            Initial Setup
                        </h1>
                        <p className="text-xl font-medium text-white shadow-sm">
                            Follow the steps below to get started.
                        </p>
                    </div>

                    {/* ── Step dots ── */}
                    <div className="flex items-start justify-center gap-3 mb-16 mt-4 touch-none">
                        {['Browser', 'Extension', 'Connect', 'Ready'].map(
                            (label, i) => {
                                // Total center-to-center = 40 + 12 + 40 + 12 + 40 = 144
                                const domDx = 144
                                // Actual center-to-center visual differences
                                const dx = domDx
                                const dy = 0
                                const angle = Math.atan2(dy, dx) * (180 / Math.PI)
                                const length = Math.sqrt(dx * dx + dy * dy)
                                
                                // 40px circle + 8px gap on each side = 56px to subtract from length
                                const targetLength = Math.max(0, length - 56)
                                // line has base dom width of 40px
                                const scaleX = targetLength / 40
                                
                                // line uses (p1 + p2)/2 translation relative to its flex midpoint
                                const transX = 0
                                const transY = 0

                                return (
                                    <React.Fragment key={i}>
                                        <div
                                            className="flex flex-col items-center gap-2 relative z-10 w-20 shrink-0 select-none"
                                        >
                                            <div
                                                className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-2xl relative"
                                                style={{
                                                    background:
                                                        i < step
                                                            ? tokens.gradientAccent
                                                            : i === step
                                                              ? 'rgba(168, 85, 247, 0.15)'
                                                              : 'rgba(255, 255, 255, 0.05)',
                                                    border:
                                                        i === step
                                                            ? `2px solid #a855f7`
                                                            : i < step
                                                              ? 'none'
                                                              : '1px solid rgba(255,255,255,0.15)',
                                                    color:
                                                        i <= step
                                                            ? 'white'
                                                            : 'rgba(255,255,255,0.3)',
                                                    boxShadow: i === step ? '0 0 20px rgba(168, 85, 247, 0.4)' : undefined,
                                                    transitionDuration: '400ms'
                                                }}
                                            >
                                                {i === step && (
                                                    <div className="absolute inset-0 rounded-full animate-ping bg-purple-500/20" />
                                                )}
                                                {i < step ? (
                                                    <HiOutlineCheck className="text-xl" />
                                                ) : (
                                                    i + 1
                                                )}
                                            </div>
                                            <span
                                                className="text-[11px] font-medium tracking-wide"
                                                style={{
                                                    color:
                                                        i <= step
                                                            ? 'white'
                                                            : tokens.muted,
                                                    textShadow: i <= step ? '0 0 10px rgba(255,255,255,0.3)' : 'none'
                                                }}
                                            >
                                                {label}
                                            </span>
                                        </div>
                                        {i < 3 && (
                                            <div
                                                className="h-[2px] rounded-full shrink-0 w-10 z-0"
                                                style={{
                                                    transform: `translate(${transX}px, ${transY}px) rotate(${angle}deg) scaleX(${scaleX})`,
                                                    marginTop: '19px', // centers perfectly with the 40px circle vertically
                                                    transformOrigin: 'center',
                                                    background:
                                                        i < step
                                                            ? tokens.gradientAccent
                                                            : tokens.border,
                                                    opacity: 0.6,
                                                    transition: 'all 0.3s'
                                                }}
                                            />
                                        )}
                                    </React.Fragment>
                                )
                            },
                        )}
                    </div>

                    {/* ── Main card ── */}
                    <div className="glass-card rounded-3xl overflow-hidden shadow-2xl">
                        {/* ═══ STEP 0: Choose browser ═══ */}
                        {step === 0 && (
                            <div className="p-8 space-y-6">
                                <div>
                                    <h2
                                        className="text-2xl font-semibold mb-2"
                                        style={{
                                            color: 'white',
                                            letterSpacing: '-0.025em',
                                        }}
                                    >
                                        Which browser do you use?
                                    </h2>
                                    <p className="text-sm font-light text-white/80">
                                        The installation instructions are
                                        tailored to your browser.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    {(
                                        [
                                            {
                                                id: 'chrome',
                                                label: 'Google Chrome',
                                                sub: 'Also works with Brave',
                                                emoji: '🌐',
                                            },
                                            {
                                                id: 'edge',
                                                label: 'Microsoft Edge',
                                                sub: "Windows' built-in browser",
                                                emoji: '🔷',
                                            },
                                            {
                                                id: 'safari',
                                                label: 'Safari',
                                                sub: 'Mac only',
                                                emoji: '🧭',
                                            },
                                        ] as const
                                    ).map((b) => (
                                        <button
                                            key={b.id}
                                            onClick={() => setBrowser(b.id)}
                                            className="browser-option flex items-center gap-4 w-full text-left px-5 py-4 rounded-2xl transition-all duration-200"
                                            style={{
                                                background:
                                                    browser === b.id
                                                        ? 'hsl(270 70% 65% / 0.1)'
                                                        : 'hsl(240 20% 15%)',
                                                border: `2px solid ${
                                                    browser === b.id
                                                        ? 'hsl(270 70% 65%)'
                                                        : tokens.border
                                                }`,
                                            }}
                                        >
                                            <span className="text-2xl">
                                                {b.emoji}
                                            </span>
                                            <div className="flex-1">
                                                <p
                                                    className="font-semibold text-sm"
                                                    style={{
                                                        color: 'white',
                                                    }}
                                                >
                                                    {b.label}
                                                </p>
                                                <p
                                                    className="text-xs font-light"
                                                    style={{
                                                        color: tokens.muted,
                                                    }}
                                                >
                                                    {b.sub}
                                                </p>
                                            </div>
                                            {browser === b.id && (
                                                <HiOutlineCheck
                                                    className="text-xl flex-shrink-0"
                                                    style={{
                                                        color: tokens.primary,
                                                    }}
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>

                                <GradientBtn
                                    icon={<HiOutlineArrowRight />}
                                    onClick={onNext}
                                    disabled={!browser}
                                >
                                    Continue
                                </GradientBtn>
                            </div>
                        )}

                        {/* ═══ STEP 1: Install extension ═══ */}
                        {step === 1 && (
                            <div>
                                {/* Progress header */}
                                <div
                                    className="px-8 pt-8 pb-5 space-y-4"
                                    style={{
                                        borderBottom: `1px solid ${tokens.border}`,
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
                                            style={{
                                                background:
                                                    'hsl(270 70% 65% / 0.15)',
                                            }}
                                        >
                                            <HiOutlineCommandLine
                                                style={{
                                                    color: tokens.primary,
                                                    strokeWidth: 1,
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <h2
                                                className="text-xl font-semibold"
                                                style={{
                                                    color: 'white',
                                                    letterSpacing: '-0.025em',
                                                }}
                                            >
                                                Install the Extension
                                            </h2>
                                            <p
                                                className="text-xs font-light"
                                                style={{ color: tokens.muted }}
                                            >
                                                Step {installSubStep + 1} of{' '}
                                                {totalInstallSteps}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Progress bar */}
                                    <div
                                        className="h-1 rounded-full w-full overflow-hidden"
                                        style={{ background: tokens.border }}
                                    >
                                        <div
                                            className="h-full rounded-full progress-fill"
                                            style={{
                                                width: `${((installSubStep + 1) / totalInstallSteps) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Sub-step content */}
                                <div className="px-8 py-6">
                                    <div className="flex items-center gap-3 mb-5">
                                        <div
                                            className="w-8 h-8 rounded-xl flex items-center justify-center text-lg"
                                            style={{
                                                background:
                                                    'hsl(270 70% 65% / 0.1)',
                                                color: tokens.primary,
                                            }}
                                        >
                                            {currentInstallStep.icon}
                                        </div>
                                        <h3
                                            className="font-semibold text-base"
                                            style={{ color: 'white' }}
                                        >
                                            {currentInstallStep.title}
                                        </h3>
                                    </div>
                                    {currentInstallStep.content}
                                </div>

                                {/* Navigation */}
                                <div
                                    className="px-8 py-5 flex items-center gap-3"
                                    style={{
                                        borderTop: `1px solid ${tokens.border}`,
                                        background: 'hsl(240 25% 8% / 0.5)',
                                    }}
                                >
                                    <GhostBtn
                                        icon={<HiOutlineArrowLeft />}
                                        onClick={() => {
                                            if (installSubStep === 0) onPrev()
                                            else setInstallSubStep((s) => s - 1)
                                        }}
                                    >
                                        Back
                                    </GhostBtn>

                                    {installSubStep < totalInstallSteps - 1 ? (
                                        <div className="flex-1">
                                            <GradientBtn
                                                icon={<HiOutlineArrowRight />}
                                                onClick={() =>
                                                    setInstallSubStep(
                                                        (s) => s + 1,
                                                    )
                                                }
                                            >
                                                Next
                                            </GradientBtn>
                                        </div>
                                    ) : (
                                        <div className="flex-1">
                                            <GradientBtn
                                                secondary
                                                icon={<HiOutlineCheck />}
                                                onClick={onNext}
                                            >
                                                Extension installed! Continue
                                            </GradientBtn>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ═══ STEP 2: Connect Frame.io ═══ */}
                        {step === 2 && (
                            <div className="p-8 space-y-6">
                                <div>
                                    <h2
                                        className="text-xl font-semibold mb-1"
                                        style={{
                                            color: 'white',
                                            letterSpacing: '-0.025em',
                                        }}
                                    >
                                        Connect your Frame.io account
                                    </h2>
                                    <p className="text-sm font-light text-white/80">
                                        We need access to your Adobe Frame.io
                                        account to audit your assets in
                                        real-time.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <SubStep
                                        num={1}
                                        title="Click the button below."
                                    >
                                        <p>
                                            An Adobe sign-in window will open
                                            where you can log in with your
                                            Frame.io credentials.
                                        </p>
                                    </SubStep>
                                    <SubStep
                                        num={2}
                                        title="Sign in with your Adobe account."
                                    >
                                        <p>
                                            Use the same email and password you
                                            use on Frame.io.
                                        </p>
                                    </SubStep>
                                    <SubStep
                                        num={3}
                                        title='Click "Allow access".'
                                    >
                                        <p>
                                            When Adobe asks for permission,
                                            confirm by clicking Allow.
                                        </p>
                                    </SubStep>
                                    <SubStep
                                        num={4}
                                        title='Come back here and click "Verify".'
                                    >
                                        <p>
                                            We run a quick check to confirm it
                                            worked.
                                        </p>
                                    </SubStep>
                                </div>

                                {isConnected ? (
                                    <div
                                        className="rounded-2xl p-4 flex items-center gap-3"
                                        style={{
                                            background:
                                                'hsl(160 70% 45% / 0.1)',
                                            border: '1px solid hsl(160 70% 45% / 0.4)',
                                        }}
                                    >
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center"
                                            style={{
                                                background:
                                                    'hsl(160 70% 45% / 0.2)',
                                            }}
                                        >
                                            <HiOutlineUserCircle
                                                className="text-2xl"
                                                style={{
                                                    color: 'hsl(160 70% 55%)',
                                                    strokeWidth: 1,
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <p
                                                className="text-xs font-semibold uppercase tracking-wider"
                                                style={{
                                                    color: 'hsl(160 70% 55%)',
                                                }}
                                            >
                                                ✅ Connected
                                            </p>
                                            <p
                                                className="font-light text-sm"
                                                style={{
                                                    color: 'white',
                                                }}
                                            >
                                                {frameioUser?.name}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <GradientBtn
                                        icon={<HiOutlineLink />}
                                        onClick={handleConnectFrameio}
                                    >
                                        Authorize with Frame.io
                                    </GradientBtn>
                                )}

                                <button
                                    className="w-full flex items-center justify-center gap-2 py-2 text-sm font-light transition-colors duration-200"
                                    style={{
                                        color: isChecking
                                            ? tokens.primary
                                            : tokens.muted,
                                    }}
                                    onClick={() => checkConnection(true)}
                                    disabled={isChecking}
                                >
                                    {isChecking ? (
                                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <HiOutlineRefresh
                                            style={{ strokeWidth: 1 }}
                                        />
                                    )}
                                    Already authorized — verify connection
                                </button>

                                <div className="flex items-center gap-3 pt-2">
                                    <GhostBtn
                                        icon={<HiOutlineArrowLeft />}
                                        onClick={onPrev}
                                    >
                                        Back
                                    </GhostBtn>
                                    <div className="flex-1">
                                        <GradientBtn
                                            icon={<HiOutlineArrowRight />}
                                            onClick={onNext}
                                            disabled={!isConnected}
                                        >
                                            Continue
                                        </GradientBtn>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ═══ STEP 3: Done ═══ */}
                        {step === 3 && (
                            <div className="p-8 flex flex-col items-center text-center space-y-6">
                                <div
                                    className="w-20 h-20 rounded-full flex items-center justify-center"
                                    style={{
                                        background: tokens.gradientAccent,
                                        boxShadow:
                                            '0 0 48px hsl(270 70% 65% / 0.5)',
                                    }}
                                >
                                    <HiOutlineCheck
                                        className="text-4xl text-white"
                                        style={{ strokeWidth: 2 }}
                                    />
                                </div>
                                <div>
                                    <h2
                                        className="text-2xl font-semibold gradient-text mb-2"
                                        style={{ letterSpacing: '-0.025em' }}
                                    >
                                        All set! 🎉
                                    </h2>
                                    <p
                                        className="text-sm font-light max-w-sm"
                                        style={{ color: tokens.muted }}
                                    >
                                        The extension is installed and your
                                        Frame.io account is linked. You're ready
                                        to start auditing.
                                    </p>
                                </div>
                                <div className="w-full max-w-sm">
                                    <GradientBtn onClick={handleComplete}>
                                        Go to Dashboard
                                    </GradientBtn>
                                </div>
                                <button
                                    className="text-sm font-light underline"
                                    style={{ color: tokens.muted }}
                                    onClick={onPrev}
                                >
                                    Go back
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <p className="text-center text-[10px] font-light mt-8 uppercase tracking-widest text-white/30">
                        © {new Date().getFullYear()} CreatIQ System · Advanced
                        Video Logistics
                    </p>
                </div>
            </div>
        </>
    )
}

export default Onboarding
