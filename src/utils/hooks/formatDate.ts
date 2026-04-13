import { useCallback } from 'react'

const useFormatDate = () => {
    const formatDate = useCallback((date: Date): string => {
        const day = String(date.getDate() + 1).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        return `${day}-${month}-${year}`
    }, [])

    return formatDate
}

export default useFormatDate
