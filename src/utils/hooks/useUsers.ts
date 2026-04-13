import { useState, useEffect, useCallback } from 'react'
import { fetchUsers } from '@/api/api'

export const useUsers = () => {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const fetchUsersData = useCallback(async () => {
        try {
            setLoading(true)
            const response = await fetchUsers()
            if (response) {
                setUsers(
                    response.usuarios ||
                        (Array.isArray(response) ? response : []),
                )
            }
        } catch (error) {
            console.error('Error fetching users:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchUsersData()
    }, [fetchUsersData])

    return {
        users,
        loading,
        fetchUsers: fetchUsersData,
    }
}
