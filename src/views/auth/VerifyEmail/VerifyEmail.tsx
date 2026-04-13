import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { apiVerifyEmail } from '@/services/AuthService'
import { Spinner, Button, Alert } from '@/components/ui'
import { HiCheckCircle, HiXCircle } from 'react-icons/hi'

const VerifyEmail = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const token = searchParams.get('token')

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
        'loading'
    )
    const [message, setMessage] = useState('')
    const [countdown, setCountdown] = useState(5)

    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setStatus('error')
                setMessage('No verification token provided.')
                return
            }

            try {
                const resp = await apiVerifyEmail(token)
                if (resp.data && resp.data.ok) {
                    setStatus('success')
                    setMessage(resp.data.msg)
                } else {
                    setStatus('error')
                    setMessage(
                        resp.data?.msg || 'Verification failed. The link may be expired.'
                    )
                }
            } catch (err: any) {
                setStatus('error')
                setMessage(
                    err.response?.data?.msg ||
                        'An unexpected error occurred. Please try again later.'
                )
            }
        }

        verify()
    }, [token])

    useEffect(() => {
        if (status === 'success') {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer)
                        navigate('/sign-in')
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
            return () => clearInterval(timer)
        }
    }, [status, navigate])

    const onSignIn = () => {
        navigate('/sign-in')
    }

    return (
        <div className="text-center">
            {status === 'loading' && (
                <div className="flex flex-col items-center justify-center">
                    <Spinner size="40px" />
                    <p className="mt-4 text-white">Verifying your account...</p>
                </div>
            )}

            {status === 'success' && (
                <div>
                    <div className="mb-4 flex justify-center text-6xl text-emerald-500">
                        <HiCheckCircle />
                    </div>
                    <h3 className="mb-2 text-white font-bold text-2xl">Account Verified!</h3>
                    <p className="mb-4 text-emerald-100/80">{message}</p>
                    <p className="mb-8 text-sm text-gray-400 italic">
                        Redirecting to sign-in page in {countdown} seconds...
                    </p>
                    <Button block variant="solid" onClick={onSignIn} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-none transition-all">
                        Sign In Now
                    </Button>
                </div>
            )}

            {status === 'error' && (
                <div>
                    <div className="mb-4 flex justify-center text-6xl text-red-500">
                        <HiXCircle />
                    </div>
                    <h3 className="mb-2 text-white">Verification Error</h3>
                    <Alert type="danger" showIcon className="mb-8 text-left">
                        {message}
                    </Alert>
                    <Button block variant="default" onClick={onSignIn}>
                        Back to Login
                    </Button>
                </div>
            )}
        </div>
    )
}

export default VerifyEmail
